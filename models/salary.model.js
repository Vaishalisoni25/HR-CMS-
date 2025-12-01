import mongoose from "mongoose";
import { SALARY_STATUS } from "../config/constant.js";
const { Schema, model } = mongoose;

const salarySchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },

  earnings: {
    basicSalary: { type: Number, required: true },
    overtime: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    leaveEncashment: { type: Number, default: 0 },
    otherAdjustment: { type: Number, default: 0 },
  },

  deductions: {
    TDS: { type: Number, default: 0 },
    PF: { type: Number, default: 0 },
    lwpDeduction: { type: Number, default: 0 },
  },

  status: {
    type: String,
    enum: Object.values(SALARY_STATUS),
    default: SALARY_STATUS.GENERATED,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },

  netSalary: { type: Number, required: true },
});
export default model("Salary", salarySchema);
