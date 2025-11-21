const { z } = require("zod");

const dateString = z.preprocess((arg) => {
  if (typeof arg === "String" || arg instanceof string) return new Date(arg);
  if (arg instanceof Date) return arg;
  return arg;
}, z.date());

exports.applyLeaveSchema = z.object({
  leaveType: z.enum(["Annual", "Sick", "Casual", "Privilege", "WFH", "LWP"]),
  FormData: dateString,
  toDate: dateString,
  reason: z.string().max(1000).optional(),
});
exports.approvelSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().max(1000).optional(),
});
