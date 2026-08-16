import { z } from "zod";

export const ToggleReactionSchema = z.object({
  type: z.enum(["like", "heart", "celebrate"]).default("like"),
});

export type ToggleReactionInput = z.infer<typeof ToggleReactionSchema>;
