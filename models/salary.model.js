import { SALARY_STATUS } from "../config/constant.js";
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const salarySchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },

  basicSalary: { type: Number, required: true },
  hra: { type: Number, default: 0 },
  da: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },

  deductions: {
    LWP: { type: Number, default: 0 },
    PF: { type: Number, default: 0 },
  },
  netSalary: { type: Number, required: true },

  status: {
    type: String,
    enum: Object.values(SALARY_STATUS),
    default: SALARY_STATUS.GENERATED,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});
export default model("Salary", salarySchema);
