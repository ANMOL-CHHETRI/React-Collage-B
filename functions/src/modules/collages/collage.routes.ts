import { Router } from "express";
import { CollageController } from "./collage.controller.js";
import { authenticate, optionalAuthenticate } from "../../middleware/authenticate.js";
import { authorizeRole } from "../../middleware/authorize.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";
import { CreateCollageSchema, UpdateCollageSchema, ListCollagesQuerySchema } from "./collage.schema.js";

const router = Router();
const controller = new CollageController();

router.get("/", optionalAuthenticate, validateQuery(ListCollagesQuerySchema), (req, res, next) =>
  controller.list(req, res, next)
);

router.get("/:id", optionalAuthenticate, (req, res, next) => controller.getById(req, res, next));

router.post(
  "/",
  authenticate,
  authorizeRole("editor", "admin"),
  validateBody(CreateCollageSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.patch(
  "/:id",
  authenticate,
  validateBody(UpdateCollageSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete("/:id", authenticate, (req, res, next) => controller.delete(req, res, next));

export default router;
