import { z } from "zod";

export const CreateCollageSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(120).trim(),
  description: z.string().max(2000).trim().default(""),
  visibility: z.enum(["public", "private"]).default("public"),
  projectId: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
});

export const UpdateCollageSchema = CreateCollageSchema.partial();

export const ListCollagesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
  visibility: z.enum(["public", "private"]).optional(),
  ownerId: z.string().optional(),
  projectId: z.string().optional(),
});

export type CreateCollageInput = z.infer<typeof CreateCollageSchema>;
export type UpdateCollageInput = z.infer<typeof UpdateCollageSchema>;
export type ListCollagesQueryInput = z.infer<typeof ListCollagesQuerySchema>;
