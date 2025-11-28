import mongoose from "mongoose";
import { id } from "zod/v4/locales";

export const datePrepprocess = z.preprocess((arg) => {
  if (typeof arg === "string") return new Date(arg);
  if (arg instanceof Date) return arg;
  return arg;
}, z.date());

const statusEnum = ["Absent", "Attended", "Leave", "LWP", "WFH", "Half-Day"];

const leaveTypeEnum = ["Sick", "Privilege", "WFH", "LWP"];

//markattendance  payload

export const markAttendance = z.object({
  employeeId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid employeeId",
  }),
  date: z.preprocess(
    (arg) =>
      typeof arg === "string" || arg instanceof String ? new Date(arg) : arg,
    z.date({ invalid_type_error: "Invalid date format" })
  ),

  status: z.enum(["Absent", "Attended", "Leave", "LWP", "WFH", "Half-Day"], {
    required_error: "Status is required",
  }),

  leaveType: z.enum(["Sick", "Privilege", "WFH", "LWP"]).nullable().optional(),
});
