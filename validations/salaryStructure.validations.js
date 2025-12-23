import mongoose from "mongoose";
import { z } from "zod";
import { SALARY_STRUCTURE_STATUS } from "../config/constant.js";

export const SalaryStructureSchema = z.object({
  employeeId: z
    .string()
    .refine(
      (id) => mongoose.Types.ObjectId.isValid(id),
      "Invalid MongoDB ObjectId"
    ),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  basicPay: z.coerce.number().min(0),
  HRA: z.coerce.number().min(0).optional(),
  specialAllowance: z.coerce.number().min(0).optional(),
  grossSalary: z.coerce.number().min(0).optional(),
  effectiveFrom: z.coerce.date().optional(),
  effectiveTo: z.coerce.date().optional(),
  status: z.enum(Object.values(SALARY_STRUCTURE_STATUS)).optional(),
});
