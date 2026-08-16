import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export function authorizeRole(...allowedRoles: Array<"viewer" | "editor" | "admin">) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized("Authentication required for this resource"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(`Role '${req.user.role}' is not authorized to perform this action. Required: ${allowedRoles.join(", ")}`)
      );
    }

    next();
  };
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  return authorizeRole("admin")(req, res, next);
}

export function requireEditorOrAdmin(req: Request, res: Response, next: NextFunction): void {
  return authorizeRole("editor", "admin")(req, res, next);
}
