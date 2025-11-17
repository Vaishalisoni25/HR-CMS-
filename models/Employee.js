const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
  },
  phone: { type: String },
  companyCode: { type: String },

  joiningDate: {
    type: Date,
    required: true,
  },

  LeavePolicy: { type: String, required: true },

  department: { type: String },

  status: { enums: ["Active", "Inactive"] },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
