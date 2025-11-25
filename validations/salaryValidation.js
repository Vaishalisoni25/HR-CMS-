import { z } from "zod";

export const salaryGenerateSchema = z.object({
  employeeId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  basicSalary: z.number().min(0),
  hra: z.number().optional(),
  da: z.number().optional(),
  bonus: z.number().optional(),
});
