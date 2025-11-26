// attendance.controller.js

import Attendance from "../models/attendance.model.js";
import { ROLES } from "../config/constant.js";

// MARK ATTENDANCE
export async function markAttendance(req, res) {
  try {
    if (![ROLES.HR, ROLES.SUPERADMIN].includes(req.user.role)) {
      return (
        res.status(403),
        json({ msg: "Only HR can Marked leave and attendance" })
      );
    }
    const { date, status, leaveType } = req.body;
    const employeeId = req.user.id;
    if (!employeeId) {
      return res.status(400).json({ msg: "employee is required" });
    }
    if (!date || !status) {
      return res.status(400).json({ msg: "date and status are required" });
    }

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: d },
      { employeeId, date: d, status, leaveType: leaveType || null },

      { upsert: true, new: true }
    );

    return res.json({
      msg: "Attendance marked/ Leave Marked Successfully",
      attendance,
    });
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
      filter.employeeId = req.query.employeeId; // HR/Superadmin can filter by emplyoyee Id
    }

    //get by month /year
    const { month, year } = req.query;
    if (month && year) {
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0),
      };
    } else if (year) {
      filter.date = {
        $gte: new Date(year, 0, 1),
        $lte: new Date(year, 11, 31),
      };
    }

    const records = await Attendance.find(filter);
    return res.json(records);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}
