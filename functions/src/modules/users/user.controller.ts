import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";

const service = new UserService();

export class UserController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await service.getProfile(req.user!.uid);
      res.json({ data: profile });
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await service.updateProfile(req.user!.uid, req.body);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await service.getProfile(String(req.params.id));
      res.json({ data: profile });
    } catch (err) {
      next(err);
    }
  }

  async adminList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = Number(req.query.limit) || 50;
      const users = await service.adminListUsers(limit);
      res.json({ data: users });
    } catch (err) {
      next(err);
    }
  }

  async adminUpdateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await service.adminUpdateRole(String(req.params.id), req.body);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
}
