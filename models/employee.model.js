const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  companyCode: String,
  joiningDate: Date,
  leavePolicy: String,
  department: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
