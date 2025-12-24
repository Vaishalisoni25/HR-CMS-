import { z } from "zod";
import mongoose from "mongoose";
import { FEEDBACK_TYPES, EMAIL_STATUS } from "../config/constant.js";

export const FeedbackSchema = z.object({
  employeeId: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), "Invalid employeeId"),

  type: z.enum(Object.values(FEEDBACK_TYPES)),

  subject: z.string().min(3, "Subject is required"),

  content: z.string().min(10, "Content is required"),

  rating: z.number().min(1).max(5).optional(),

  emailStatus: z.enum(Object.values(EMAIL_STATUS)).optional(),

  emailID: z.string().optional(),
});
