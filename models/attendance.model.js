import { Schema, model } from "mongoose";
import { ATTENDANCE_STATUSES, LEAVE_TYPES } from "../config/constant.js";

const AttendanceSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUSES),

      required: true,
    },
    //Store which type leave was applied
    leaveType: {
      type: String,
      enum: Object.values(LEAVE_TYPES),
      default: null,
    },

    isPaidLeave: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//to Avoid duplocate attendance on same day

AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default model("Attendance", AttendanceSchema);
