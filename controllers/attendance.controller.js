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

    if (!date) {
      return res.status(400).json({ msg: "Date is required" });
    }
    if (!status) {
      return res.status(400).json({ msg: "status is required" });
    }

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: d },
      { employeeId, date: d, status, leaveType: leaveType || null },
      { upsert: true, new: true }
    );
    if (status === "Leave") {
      const employee = await employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ msg: "Employee not found" });
      }
      employee.usedLeaves += 1;
      await employee.save();
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
      filter.employeeId = req.query.employeeId;
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
