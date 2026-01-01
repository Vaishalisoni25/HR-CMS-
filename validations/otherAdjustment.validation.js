import { z } from "zod";

export const AdjustmentSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  type: z.enum(["ADD", "LESS"]).optional(),
  amount: z.coerce.number(),
  description: z.string().optional(),
});
