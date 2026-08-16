import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";

import userRouter from "./modules/users/user.routes.js";
import projectRouter from "./modules/projects/project.routes.js";
import collageRouter from "./modules/collages/collage.routes.js";
import imageRouter from "./modules/images/image.routes.js";
import commentRouter from "./modules/comments/comment.routes.js";
import reactionRouter from "./modules/reactions/reaction.routes.js";

export const app = express();

// Security and common middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "React-Collage-B Express API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount modules under /api/v1
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/collages", collageRouter);
app.use("/api/v1/collages/:id/images", imageRouter);
app.use("/api/v1/collages/:id/comments", commentRouter);
app.use("/api/v1/collages/:id/reactions", reactionRouter);

// Centralized error handling
app.use(errorHandler);
