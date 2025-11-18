const { types } = require("mime-types");
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },

  employeeEmail: { type: String, required: true },

  employeeName: { type: String, required: true },

  date: { type: Date, required: true, default: Date.now },

  Satuts: {
    type: String,
    required: true,
    enum: ["present", "Leave"],
  },

  createdAt: { type: Date, default: Date.now },

  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  LeavePolicy: { type: String, required: true },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
