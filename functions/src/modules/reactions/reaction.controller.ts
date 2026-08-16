import { Request, Response, NextFunction } from "express";
import { ReactionService } from "./reaction.service.js";

const service = new ReactionService();

export class ReactionController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reactions = await service.list(String(req.params.id));
      res.json({ data: reactions });
    } catch (err) {
      next(err);
    }
  }

  async toggle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await service.toggleReaction(String(req.params.id), req.user!.uid, req.body);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await service.removeReaction(String(req.params.id), req.user!.uid);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  }
}
