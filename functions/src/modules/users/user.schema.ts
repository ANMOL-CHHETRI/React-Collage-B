import { z } from "zod";

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).max(80).trim().optional(),
  photoURL: z.string().url().nullable().optional(),
});

export const AdminUpdateUserRoleSchema = z.object({
  role: z.enum(["viewer", "editor", "admin"]),
  isActive: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type AdminUpdateUserRoleInput = z.infer<typeof AdminUpdateUserRoleSchema>;
