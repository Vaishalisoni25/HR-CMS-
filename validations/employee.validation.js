const { z } = require("zod");

exports.employeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  companyCode: z.string(),
  joiningdate: z.string().datetime(),
  leavePolicy: z.string().optional(),
  department: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
