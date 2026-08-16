import { Router } from "express";
import { CommentController } from "./comment.controller.js";
import { authenticate, optionalAuthenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { CreateCommentSchema, UpdateCommentSchema } from "./comment.schema.js";

const router = Router({ mergeParams: true });
const controller = new CommentController();

router.get("/", optionalAuthenticate, (req, res, next) => controller.list(req, res, next));

router.post(
  "/",
  authenticate,
  validateBody(CreateCommentSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.patch(
  "/:commentId",
  authenticate,
  validateBody(UpdateCommentSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete("/:commentId", authenticate, (req, res, next) => controller.delete(req, res, next));

export default router;
