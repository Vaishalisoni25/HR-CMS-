import { z } from "zod";
import mongoose from "mongoose";

export const employeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional().optional(),
  joiningDate: z.string().optional(),
  employmentType: z.string().optional(),
  allowedLeaves: z.number().optional(),
  position: z.string().optional(),
  employeeCode: z.string().optional(),
  salaryStructureId: z
    .string()
    .refine(
      (id) => mongoose.Types.ObjectId.isValid(id),
      "Invalid MongoDB ObjectId"
    )
    .optional(),

  status: z.enum(["Active", "Inactive"]).optional(),
  tax: z.enum(["PF", "TDS"]),
});
