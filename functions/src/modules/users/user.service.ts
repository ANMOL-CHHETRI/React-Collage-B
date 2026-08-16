import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../config/firebaseAdmin.js";
import { AppError } from "../../utils/errors.js";
import { UpdateProfileInput, AdminUpdateUserRoleInput } from "./user.schema.js";

export class UserService {
  private collection = db.collection("users");

  async getProfile(uid: string) {
    const userDoc = await this.collection.doc(uid).get();
    if (!userDoc.exists) {
      throw AppError.notFound("User profile not found");
    }
    return { id: userDoc.id, ...userDoc.data() };
  }

  async updateProfile(uid: string, data: UpdateProfileInput) {
    const userRef = this.collection.doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw AppError.notFound("User profile not found");
    }

    const updates = {
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    };

    await userRef.update(updates);
    const updatedSnap = await userRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  }

  async adminListUsers(limit = 50) {
    const snap = await this.collection.orderBy("createdAt", "desc").limit(limit).get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async adminUpdateRole(targetUid: string, data: AdminUpdateUserRoleInput) {
    const userRef = this.collection.doc(targetUid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw AppError.notFound("User not found");
    }

    await userRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });

    const updatedSnap = await userRef.get();
    return { id: updatedSnap.id, ...updatedSnap.data() };
  }
}
