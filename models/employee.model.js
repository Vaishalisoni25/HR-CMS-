import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  companyCode: String,
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

  allowedLeaves: {
    type: Number,
    default: 15,
  },

  usedLeaves: {
    type: Number,
    default: 0,
  },

  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

export default model("Employee", EmployeeSchema);
