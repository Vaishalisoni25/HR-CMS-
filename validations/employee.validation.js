import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string.min(5),
  phone: z.string().optional(),
  joiningdate: z.string().datetime(),
  leavePolicy: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
