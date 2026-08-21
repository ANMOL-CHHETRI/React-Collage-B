import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = req.requestId;

  if (err instanceof AppError) {
    logger.warn(`[API Warning] ${req.method} ${req.originalUrl}: ${err.message}`, {
      requestId,
      status: err.statusCode,
      errorCode: err.code,
      details: err.details,
      userId: req.user?.uid,
    });

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  logger.error(`[Unhandled Server Error] ${req.method} ${req.originalUrl}:`, err, {
    requestId,
    userId: req.user?.uid,
  });

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected internal server error occurred.",
    },
  });
}

