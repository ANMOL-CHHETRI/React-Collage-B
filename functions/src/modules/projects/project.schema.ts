import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  description: z.string().max(1000).trim().default(""),
  status: z.enum(["active", "archived"]).default("active"),
  visibility: z.enum(["public", "private"]).default("public"),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
