import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { standardRateLimiter, strictRateLimiter } from "./middleware/rateLimiter.js";

import userRouter from "./modules/users/user.routes.js";
import projectRouter from "./modules/projects/project.routes.js";
import collageRouter from "./modules/collages/collage.routes.js";
import imageRouter from "./modules/images/image.routes.js";
import commentRouter from "./modules/comments/comment.routes.js";
import reactionRouter from "./modules/reactions/reaction.routes.js";
import auditRouter from "./modules/audit/audit.routes.js";

export const app = express();

// 1. Security Headers (Helmet)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Managed at Hosting layer for frontend assets
  })
);

// 2. Hardened CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "https://shopease-nepal-anmol-196e7.web.app",
  "https://shopease-nepal-anmol-196e7.firebaseapp.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(new Error(`Origin '${origin}' not allowed by CORS policy`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);

// 3. Request Correlation & Structured Logging
app.use(requestIdMiddleware);

// 4. Request Body Limit (Protection against oversized malicious payloads)
app.use(express.json({ limit: "2mb" }));

// 5. Global Standard Rate Limiter
app.use(standardRateLimiter);

// 6. Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "React-Collage-B Express API",
    version: "1.0.0",
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
  });
});

// 7. Mount Modules under /api/v1
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/collages", collageRouter);
app.use("/api/v1/collages/:id/images", imageRouter);
app.use("/api/v1/collages/:id/comments", strictRateLimiter, commentRouter);
app.use("/api/v1/collages/:id/reactions", strictRateLimiter, reactionRouter);
app.use("/api/v1/audit-logs", strictRateLimiter, auditRouter);

// 8. Centralized Error Handling
app.use(errorHandler);
