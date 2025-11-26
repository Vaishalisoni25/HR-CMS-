import { z } from "zod";

const dateString = z.preprocess((arg) => {
  if (typeof arg === "String" || arg instanceof string) return new Date(arg);
  if (arg instanceof Date) return arg;
  return arg;
}, z.date());

export const applyLeaveSchema = z.object({
  leaveType: z.enum([
    "Annual",
    "Sick",
    "Casual",
    "Privilege",
    "Halfday",
    "WFH",
    "LWP",
  ]),
  FormData: dateString,
  toDate: dateString,
  reason: z.string().max(1000).optional(),
});
export const approvelSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().max(1000).optional(),
});
