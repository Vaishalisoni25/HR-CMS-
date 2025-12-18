import mongoose from "mongoose";
import { z } from "zod";

export const AdjustmentSchema = z.object({
  employeeId: z
    .string()
    .refine(
      (id) => mongoose.Types.ObjectId.isValid(id),
      "Invalid MongoDB ObjectId"
    ),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  type: z.enum([ADD, LESS]),
  description: z.string(),
  image: z.string().optional(),
  createdAt: z.coerce.date(),
});
