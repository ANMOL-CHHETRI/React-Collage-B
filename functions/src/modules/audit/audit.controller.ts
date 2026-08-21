import { Request, Response, NextFunction } from "express";
import { AuditService } from "./audit.service.js";

export class AuditController {
  private service = new AuditService();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 20;
      const startAfter = typeof req.query.startAfter === "string" ? req.query.startAfter : undefined;
      const result = await this.service.listAuditLogs(limit, startAfter);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
