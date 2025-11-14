const Attendance = require("../models/Attenddance");

exports.markAttendance = async (req, res) => {
  try {
    const { employee, status } = req.body;
    const att = await Attendance.create({ employee, status });
    res.json(att);
  } catch (err) {
    res.status(400).json({ massage: err.massage });
  }
};
