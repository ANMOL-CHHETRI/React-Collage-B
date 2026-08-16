import { Request, Response, NextFunction } from "express";
import { CommentService } from "./comment.service.js";

const service = new CommentService();

export class CommentController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comments = await service.list(String(req.params.id));
      res.json({ data: comments });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await service.create(String(req.params.id), req.user!, req.body);
      res.status(201).json({ data: comment });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await service.update(
        String(req.params.id),
        String(req.params.commentId),
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
      await service.delete(
        String(req.params.id),
        String(req.params.commentId),
        req.user!.uid,
        req.user!.role
      );
      res.json({ data: { message: "Comment deleted successfully" } });
    } catch (err) {
      next(err);
    }
  }
}
