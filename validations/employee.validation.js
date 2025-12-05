import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  joiningDate: z.string(),
  employmentType: z.string(),
  allowedLeaves: z.number().optional(),
  position: z.string().optional(),
  companyCode: z.string().optional(),
  basicSalary: z.string().optional(),

  status: z.enum(["Active", "Inactive"]).optional(), // Need to ask
});
