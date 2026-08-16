import { z } from "zod";

export const RegisterImageSchema = z.object({
  storagePath: z.string().min(5).trim(),
  downloadUrl: z.string().url().trim(),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  size: z.number().max(10 * 1024 * 1024, "Image size must be less than 10MB"),
  width: z.number().optional(),
  height: z.number().optional(),
  position: z.number().default(0),
});

export const UpdateImagePositionSchema = z.object({
  position: z.number().min(0),
});

export type RegisterImageInput = z.infer<typeof RegisterImageSchema>;
export type UpdateImagePositionInput = z.infer<typeof UpdateImagePositionSchema>;
