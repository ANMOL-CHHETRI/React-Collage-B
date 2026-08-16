import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../utils/errors.js";

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(
          AppError.badRequest(
            "Validation failed",
            err.errors.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            }))
          )
        );
      } else {
        next(err);
      }
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req.query);
      if (req.query && typeof req.query === "object") {
        Object.assign(req.query, parsed);
      }
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(
          AppError.badRequest(
            "Query parameter validation failed",
            err.errors.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            }))
          )
        );
      } else {
        next(err);
      }
    }
  };
}
