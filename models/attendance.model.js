import { Schema, model } from "mongoose";

const AttendanceSchema = new Schema({
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
    enum: ["Sick", "Privilege", "WFH", "LWP", null],
    default: null,
  },

  isPaidLeave: {
    type: Boolean,
    default: true,
  },
});
export default model("Attendance", AttendanceSchema);
