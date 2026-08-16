import { Request, Response, NextFunction } from "express";
import { CollageService } from "./collage.service.js";

const service = new CollageService();

export class CollageController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const collage = await service.create(req.user!.uid, req.body);
      res.status(201).json({ data: collage });
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await service.list(req.user?.uid, req.query as any);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const collage = await service.getById(String(req.params.id), req.user?.uid, req.user?.role);
      res.json({ data: collage });
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
      res.json({ data: { message: "Collage and associated assets deleted successfully" } });
    } catch (err) {
      next(err);
    }
  }
}
