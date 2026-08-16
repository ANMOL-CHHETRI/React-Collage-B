import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  console.error(`[Unhandled Error] ${req.method} ${req.originalUrl}:`, err);

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected internal server error occurred.",
    },
  });
}
