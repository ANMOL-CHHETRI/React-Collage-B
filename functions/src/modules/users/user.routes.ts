import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireAdmin } from "../../middleware/authorize.js";
import { validateBody } from "../../middleware/validate.js";
import { UpdateProfileSchema, AdminUpdateUserRoleSchema } from "./user.schema.js";

const router = Router();
const controller = new UserController();

router.get("/me", authenticate, (req, res, next) => controller.getMe(req, res, next));
router.patch("/me", authenticate, validateBody(UpdateProfileSchema), (req, res, next) =>
  controller.updateMe(req, res, next)
);

router.get("/admin/list", authenticate, requireAdmin, (req, res, next) => controller.adminList(req, res, next));
router.patch(
  "/admin/:id/role",
  authenticate,
  requireAdmin,
  validateBody(AdminUpdateUserRoleSchema),
  (req, res, next) => controller.adminUpdateRole(req, res, next)
);

router.get("/:id", authenticate, (req, res, next) => controller.getUserById(req, res, next));

export default router;
