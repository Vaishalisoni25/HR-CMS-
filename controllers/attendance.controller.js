// attendance.controller.js

import Attendance from "../models/attendance.model.js";
import { ROLES } from "../config/constant.js";

// MARK ATTENDANCE
export async function markAttendance(req, res) {
  try {
    const { date, status } = req.body;
    const employeeId = req.user.id;

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: d },
      { employeeId, date: d, status },
      { upsert: true, new: true }
    );

    return res.json({ msg: "Attendance marked", attendance });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// GET ATTENDANCE
export async function getAttendance(req, res) {
  try {
    const user = req.user;
    let filter = {};

    if (user.role !== ROLES.HR && user.role !== ROLES.SUPERADMIN) {
      filter.employeeId = user.id; // employee only sees own attendance
    } else if (req.query.employeeId) {
      filter.employeeId = req.query.employeeId; // HR/Superadmin can filter
    }

    const records = await Attendance.find(filter).sort({ date: -1 });
    return res.json(records);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}
