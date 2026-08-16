import { Request, Response, NextFunction } from "express";
import { ImageService } from "./image.service.js";

const service = new ImageService();

export class ImageController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const images = await service.list(String(req.params.id));
      res.json({ data: images });
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await service.registerImage(
        String(req.params.id),
        req.user!.uid,
        req.user!.role,
        req.body
      );
      res.status(201).json({ data: image });
    } catch (err) {
      next(err);
    }
  }

  async updatePosition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const image = await service.updatePosition(
        String(req.params.id),
        String(req.params.imageId),
        req.user!.uid,
        req.user!.role,
        req.body
      );
      res.json({ data: image });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await service.delete(
        String(req.params.id),
        String(req.params.imageId),
        req.user!.uid,
        req.user!.role
      );
      res.json({ data: { message: "Image removed from collage successfully" } });
    } catch (err) {
      next(err);
    }
  }
}
