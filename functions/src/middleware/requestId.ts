import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { logger } from "../utils/logger.js";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incomingId = req.headers["x-request-id"];
  const requestId = typeof incomingId === "string" && incomingId.trim()
    ? incomingId.trim().substring(0, 64)
    : crypto.randomUUID();

  req.requestId = requestId;
  req.startTime = Date.now();

  res.setHeader("X-Request-ID", requestId);

  res.on("finish", () => {
    const durationMs = req.startTime ? Date.now() - req.startTime : 0;
    logger.info(`${req.method} ${req.originalUrl || req.url}`, {
      requestId,
      method: req.method,
      route: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs,
      userId: req.user?.uid,
    });
  });

  next();
}
