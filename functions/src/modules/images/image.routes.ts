import { Router } from "express";
import { ImageController } from "./image.controller.js";
import { authenticate, optionalAuthenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { RegisterImageSchema, UpdateImagePositionSchema } from "./image.schema.js";

const router = Router({ mergeParams: true });
const controller = new ImageController();

router.get("/", optionalAuthenticate, (req, res, next) => controller.list(req, res, next));

router.post(
  "/",
  authenticate,
  validateBody(RegisterImageSchema),
  (req, res, next) => controller.register(req, res, next)
);

router.patch(
  "/:imageId/position",
  authenticate,
  validateBody(UpdateImagePositionSchema),
  (req, res, next) => controller.updatePosition(req, res, next)
);

router.delete("/:imageId", authenticate, (req, res, next) => controller.delete(req, res, next));

export default router;
