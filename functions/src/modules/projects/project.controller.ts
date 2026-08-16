import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project.service.js";

const service = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await service.create(req.user!.uid, req.body);
      res.status(201).json({ data: project });
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 20;
      const projects = await service.list(req.user?.uid, limit);
      res.json({ data: projects });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await service.getById(String(req.params.id), req.user?.uid, req.user?.role);
      res.json({ data: project });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await service.update(
        String(req.params.id),
        req.user!.uid,
        req.user!.role,
        req.body
      );
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.delete(String(req.params.id), req.user!.uid, req.user!.role);
      res.json({ data: { message: "Project deleted successfully" } });
    } catch (err) {
      next(err);
    }
  }
}
