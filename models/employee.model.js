const mongoose = require("mongoose");
const { number } = require("zod");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  companyCode: String,
  joiningDate: Date,
  allowedLeaves: {
    type: number,
    default: 15,
  },

  usedleaves: {
    type: number,
    deflault: 0,
  },

  department: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
