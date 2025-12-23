import { z } from "zod";
import mongoose from "mongoose";

export const salaryGenerateSchema = z.object({
  employeeId: z
    .string()
    .refine(
      (id) => mongoose.Types.ObjectId.isValid(id),
      "Invalid MongoDB ObjectId"
    ),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),

  earnings: z.object({
    basic_salary: z.number().min(0),
    overtime: z.number().min(0).optional(),
    bonus: z.number().min(0).optional(),
    leaveEncashment: z.number().min(0).optional(),
    otherAdjustment: z.number().min(0).optional(),
  }),

  deductions: z.object({
    tds: z.number().min(0).optional(),
    lwp: z.number().min(0).optional(),
    pf: z.number().min(0).optional(),
  }),

  status: z.enum(Object.values(SALARY_STATUS)).optional(),
  generatedAt: z.coerce.date().optional(),
  netSalary: z.number().min(0),
});
