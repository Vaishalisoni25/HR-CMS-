import { Schema, model } from "mongoose";

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
      enum: ["Absent", "Attended", "Leave", "LWP", "WFH", "Half-Day"],

      required: true,
    },
    //Store which type leave was applied
    leaveType: {
      type: String,
      enum: ["Sick", "Festive-Leave", "LWP"],
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
