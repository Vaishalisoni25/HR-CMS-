import Attendance from "../models/attendance.model.js";
import { ROLES } from "../config/constant.js";
import Leave from "../models/leave.model.js";

export async function markAttendance(req, res) {
  try {
    if (![ROLES.HR, ROLES.SUPERADMIN].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only HR can mark attendance" });
    }

    const { date, status, leaveType } = req.body;
    const employeeId = req.user.employeeId;

    if (!employeeId) {
      return res.status(400).json({ msg: "Employee ID is required" });
    }
    if (!date || !status) {
      return res.status(400).json({ msg: "Date and Status are required" });
    }

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    //1) MARK ATTENDANCE

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: d },
      { employeeId, date: d, status, leaveType: leaveType || null },
      { upsert: true, new: true }
    );
    //deduction

    if (status === "Leave" && leaveType) {
      const leave = await Leave.findOne({ employeeId });

      if (leave) {
        if (leaveType === "Privilege" && leave.privilege > 0) {
          leave.privilege -= 1;
        }
        if (leaveType === "Sick" && leave.sick > 0) {
          leave.sick -= 1;
        }

        await leave.save();
      }
    }

    return res.json({
      msg: "Attendance / Leave marked successfully",
      attendance,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// GET ATTENDANCE
export async function getAttendance(req, res) {
  try {
    const employeeId = req.body.employeeId;
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
