import { Schema, model } from "mongoose";
import { number } from "zod";

const EmployeeSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  companyCode: String,
  joiningDate: Date,
  allowedLeaves: {
    type: number,
    default: 15,
  },

  usedLeaves: {
    type: number,
    deflault: 0,
  },

  department: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

export default model("Employee", EmployeeSchema);
