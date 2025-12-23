import { z } from "zod";
import mongoose from "mongoose";

export const portalSettingsSchema = z.object({
  portalTitle: z.string().min(1),
  brandingLogo: z.string().min(1).url().optional(),

  themeColors: z.object({
    primary: z.string(),
    secondary: z.string(),
  }),
  defaultTimeZone: z.string().optional(),

  workingDays: z.array(
    z.enum(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
  ),
  leaveYearStart: z.enum(["JAN-DEC", "APR-MAR", "CUSTOM"]).optional(),
  enablePublicHoliday: z.boolean().default(false),
  enableMarkRules: z.boolean().default(false),
});
