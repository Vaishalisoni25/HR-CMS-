import { Schema, model } from "mongoose";

const settingsSchema = new Schema(
  {
    _id: {
      type: String,
    },
    portalTitle: {
      type: String,
      required: true,
      trim: true,
    },

    brandingLogo: {
      type: String,
      default: "",
    },

    themeColors: {
      primary: {
        type: String,
        default: "#000000",
      },
      secondary: {
        type: String,
        default: "#FFFFFF",
      },
    },

    defaultTimeZone: {
      type: String,
      default: "Asia/Kolkata",
    },

    workingDays: {
      type: [String],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },

    leaveYearStart: {
      type: String,
      enum: ["JAN-DEC", "APR-MAR", "CUSTOM"],
      default: "JAN-DEC",
    },

    enablePublicHoliday: {
      type: Boolean,
      default: false,
    },

    enableLateMarkRules: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default model("Settings", settingsSchema);
