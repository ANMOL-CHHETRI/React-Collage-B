import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

export function rateLimiter(options: RateLimitOptions) {
  const { windowMs, max, message = "Too many requests. Please try again later.", keyGenerator } = options;
  const store = new Map<string, ClientRecord>();

  // Cleanup expired entries every 2 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 120000);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator
      ? keyGenerator(req)
      : (req.user?.uid || req.ip || req.headers["x-forwarded-for"] || "anonymous").toString();

    const now = Date.now();
    let record = store.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      store.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", resetSeconds);

    if (record.count > max) {
      return next(AppError.tooManyRequests(message));
    }

    next();
  };
}

// Preset Limiters
export const standardRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
});

export const strictRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute for sensitive mutations
  message: "Rate limit exceeded for mutation endpoints. Please try again later.",
});
