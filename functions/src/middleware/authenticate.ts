import { Request, Response, NextFunction } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, db } from "../config/firebaseAdmin.js";
import { AppError } from "../utils/errors.js";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  role: "viewer" | "editor" | "admin";
  isActive: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw AppError.unauthorized("Authentication required. Bearer token missing.");
    }

    const idToken = authHeader.substring(7).trim();
    if (!idToken) {
      throw AppError.unauthorized("Authentication token is empty.");
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userDocRef = db.collection("users").doc(decodedToken.uid);
    const userSnap = await userDocRef.get();

    let userData = userSnap.data();

    // Auto-create initial profile on first authenticated API request if absent
    if (!userSnap.exists) {
      userData = {
        uid: decodedToken.uid,
        email: decodedToken.email || "",
        displayName: decodedToken.name || decodedToken.email?.split("@")[0] || "User",
        photoURL: decodedToken.picture || null,
        role: "viewer",
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };
      await userDocRef.set(userData);
    }

    if (userData?.isActive === false) {
      throw AppError.forbidden("Your account has been deactivated.");
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: userData?.displayName || decodedToken.name || "User",
      photoURL: userData?.photoURL || decodedToken.picture,
      role: (userData?.role as "viewer" | "editor" | "admin") || "viewer",
      isActive: userData?.isActive !== false,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(AppError.unauthorized("Invalid or expired authentication token."));
    }
  }
}

export async function optionalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }
  return authenticate(req, res, next);
}
