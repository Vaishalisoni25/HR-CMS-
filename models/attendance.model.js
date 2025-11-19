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
    enum: ["Absent", "Attended"],
    required: true,
  },
  leavePolicy: String,
});
module.exports = mongoose.model("Attendance", AttendanceSchema);
