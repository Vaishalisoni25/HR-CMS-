import { z } from "zod";
import mongoose from "mongoose";

export const salaryGenerateSchema = z.object({
  employeeId: z
    .string()
    .refine(
      (id) => mongoose.Types.ObjectId.isValid(id),
      "Invalid MongoDB ObjectId"
    ),
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),

  earnings: z.object({
    basicSalary: z.coerce.number().min(0),
    overtime: z.coerce.number().min(0).optional(),
    bonus: z.coerce.number().min(0).optional(),
    leaveEncashment: z.coerce.number().min(0).optional(),
    otherAdjustment: z.coerce.number().min(0).optional(),
  }),

  deductions: z.object({
    tds: z.coerce.number().min(0).optional(),
    lwp: z.coerce.number().min(0).optional(),
    pf: z.coerce.number().min(0).optional(),
  }),

  status: z.enum(Object.values(SALARY_STATUS)).optional(),
  generatedAt: z.coerce.date().optional(),
  netSalary: z.coerce.number().min(0),
});
