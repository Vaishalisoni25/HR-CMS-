const Attendance = require("../models/attendance.model");
const { ROLES } = require("../config/constant");

exports.markAttendance = async (req, res) => {
  const attendance = await Attendance.create(req.body);
  res.status(201).json(attendance);
};

exports.getAttendance = async (req, res) => {
  const filter =
    req.user.role === ROLES.HR ? { companyCode: req.user.companyCode } : {};
  const attendance = await Attendance.find(filter).populate("employeeId");
  res.json(attendance);
};
