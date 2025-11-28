import { Schema, model } from "mongoose";
import { Number } from "zod";
import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  companyCode: String,
  joiningDate: Date,

  allowedLeaves: {
    type: Number,
    default: 15,
  },

  usedLeaves: {
    type: Number,
    default: 0,
  },

  department: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

export default model("Employee", EmployeeSchema);
