import { Schema, model } from "mongoose";
const LeaveSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
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
      enum: ["PENDING", "APPROVED", "REJECED"],
      defalt: "PENDING",
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
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

export default model("Leave", LeaveSchema);
