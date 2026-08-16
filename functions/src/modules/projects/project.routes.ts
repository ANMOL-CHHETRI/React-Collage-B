import { Router } from "express";
import { ProjectController } from "./project.controller.js";
import { authenticate, optionalAuthenticate } from "../../middleware/authenticate.js";
import { authorizeRole } from "../../middleware/authorize.js";
import { validateBody } from "../../middleware/validate.js";
import { CreateProjectSchema, UpdateProjectSchema } from "./project.schema.js";

const router = Router();
const controller = new ProjectController();

router.get("/", optionalAuthenticate, (req, res, next) => controller.list(req, res, next));
router.get("/:id", optionalAuthenticate, (req, res, next) => controller.getById(req, res, next));

router.post(
  "/",
  authenticate,
  authorizeRole("editor", "admin"),
  validateBody(CreateProjectSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.patch(
  "/:id",
  authenticate,
  validateBody(UpdateProjectSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete("/:id", authenticate, (req, res, next) => controller.delete(req, res, next));

export default router;
