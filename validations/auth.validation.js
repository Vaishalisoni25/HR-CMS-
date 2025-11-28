import { z } from "zod";
import { ROLES } from "../config/constant.js";
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(5),
  role: z.enum([ROLES.SUPERADMIN, ROLES.HR, ROLES.EMPLOYEE]).optional(),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});
