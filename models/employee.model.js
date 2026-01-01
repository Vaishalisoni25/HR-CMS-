import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  EmployeeCode: String,
  joiningDate: Date,

  employmentType: {
    type: String,
    enum: ["FULL_TIME", "PART_TIME", "INTERN"],
    required: true,
  },

  position: {
    type: String,
    required: true,
    trim: true,
  },
  basicSalary: {
    type: Number,
    default: 0,
  },
  allowedLeaves: {
    type: Number,
    default: 15,
  },

  usedLeaves: {
    type: Number,
    default: 0,
  },

  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

  tax: {
    type: String,
    enum: ["PF", "TDS"],
  },
});

export default model("Employee", EmployeeSchema);
