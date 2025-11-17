const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      employeeEmail,
      employename,
      status,
      leavepolicy,
      marked,
    } = req.body;
    const attendance = await Attendance.create({
      employeeId,
      employeeEmail,
      employeeName,
      status,
      leavePolicy,
      markedBy,
    });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ massage: err.massage });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await attendance.find({
      employeeId: req.perams.employeeId,
    });

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
