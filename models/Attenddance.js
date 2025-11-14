const { types } = require("mime-types");
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  EmployeeId: { type: String, required: true },

  EmployeeEmail: { type: String, required: true },

  EmployeeName: { type: String, required: true },

  Date: { type: date, required: true },

  Satuts: {
    type: String,
    required: true,
    enum: ["present", "absent", "Leave"],
  },

  createdAt: { type: Date, default: Date.now },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  LeavePolicy: { type: String, required: true },
});
AttendanceSchema.index({ Employeename: 1, Date: 1 }, { unique: true });

const attendance = mongoose.Model("attendance", attendanceSchema);
module.exports = attendance;
