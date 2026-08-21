import { Router } from "express";
import { AuditController } from "./audit.controller.js";
import { authenticate } from "../../middleware/authenticate.js";
import { requireAdmin } from "../../middleware/authorize.js";

const router = Router();
const controller = new AuditController();

router.get("/", authenticate, requireAdmin, (req, res, next) => controller.list(req, res, next));

export default router;
