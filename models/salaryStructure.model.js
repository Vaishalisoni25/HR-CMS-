import mongoose from "mongoose";
import { SALARY_STRUCTURE_STATUS } from "../config/constant.js";

const { Schema, model } = mongoose;
const salaryStructureSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  endMonth: { type: Number, required: true },
  year: { type: Number, required: true },

  basicPay: {
    type: Number,
    required: true,
  },
  HRA: {
    type: Number,
    default: 0,
  },
  specialAllowance: {
    type: Number,
    default: 0,
  },
  grossSalary: {
    type: Number,
    required: true,
  },
  //salary start from this date
  startMonth: {
    type: Date,
    required: true,
  },

  endMonth: {
    type: Date,
  },
  //for show Increment Status
  status: {
    type: String,
    enum: Object.values(SALARY_STRUCTURE_STATUS),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default model("Salary_Structure", salaryStructureSchema);
