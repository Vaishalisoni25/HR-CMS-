const mongoose = require("mongoose");
const LeaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Employee,
  },
  employeeName: String,
  department: String,
});
