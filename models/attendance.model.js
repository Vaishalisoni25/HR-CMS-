const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
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
    enum: ["Annual", "Sick", "Casual", "Privilege", "WFH", "LWP", null],
    default: null,
  },

  isPaidLeave: {
    type: Boolean,
    default: true,
  },
});
module.exports = mongoose.model("Attendance", AttendanceSchema);
