import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(5),
  phone: z.string().optional(),
  joiningDate: z.string().datetime(),

  allowedLeaves: z.number().optional(),
  usedLeaves: z.number().optional(),

  department: z.string().optional(),
  companyCode: z.string().optional(),

  status: z.enum(["Active", "Inactive"]).optional(),
});
