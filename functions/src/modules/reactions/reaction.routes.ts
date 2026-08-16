import { Router } from "express";
import { ReactionController } from "./reaction.controller.js";
import { authenticate, optionalAuthenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { ToggleReactionSchema } from "./reaction.schema.js";

const router = Router({ mergeParams: true });
const controller = new ReactionController();

router.get("/", optionalAuthenticate, (req, res, next) => controller.list(req, res, next));

router.post(
  "/",
  authenticate,
  validateBody(ToggleReactionSchema),
  (req, res, next) => controller.toggle(req, res, next)
);

router.delete("/", authenticate, (req, res, next) => controller.remove(req, res, next));

export default router;
