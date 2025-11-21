const mongoose = require("mongoose");
const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Employee,
    },
    leaveType: {
      type: String,
      enum: ["Annual", " Sick", "Casual", "Privilage", "WFH", "LWP"],
      required: true,
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, defoult: "" },
    status: {
      type: String,
      enum: ["PENDING", "APROVED", "REJECED"],
      defalt: "PENDING",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      defalt: null,
    },
    payrollDeduction: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);
