import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(5),
  role: z.enum(["superadmin", "hr"]).optional(),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});
