 import { z } from "zod";
 import mongoose from "mongoose";

 export const portalSettingsSchema = z.object({
    portaltitle:z.string().min(1),
    brandingLogo:z.string().min(1).url()
    .optional(),

    themeColors:z.object({
     primary:z.string(),
     secondary:z.string(),
    }),
    defaultTimezone:z.string(),

    workingDays:z.string(),
    leaveYearStart:z.string(),
    

 })