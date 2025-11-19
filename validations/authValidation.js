const { z } = require("zod");

exports.registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(5),
  role: z.enum(["superadmin", "hr"]).optional(),
});
exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});
