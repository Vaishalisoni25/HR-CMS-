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
  name: z.string(),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2000).optional(),
  basicPay: z.number().min(0),
  HRA: z.number().min(0).optional(),
  specialAllowance: z.number().min(0).optional(),
  grossSalary: z.number().min(0).optional(),
  startMonth: z.coerce.date().optional(),
  endMonth: z.coerce.date().optional(),
  status: z.enum(Object.values(SALARY_STRUCTURE_STATUS)).optional(),
});
