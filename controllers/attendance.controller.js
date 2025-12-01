import Attendance from "../models/attendance.model.js";
import Employee from "../models/employee.model.js";
import { LEAVE_TYPES, ROLES } from "../config/constant.js";

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

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    let updateData = {
      employeeId,
      date: d,
      status,
      leaveType: LEAVE_TYPES,
    };

    if (status === "Leave") {
      if (employee.usedLeaves < employee.allowedLeaves) {
        employee.usedLeaves += 1;
        await employee.save();

        updateData.isPaidLeave = true;
        updateData.status = "Leave";
      } else {
        updateData.isPaidLeave = false;
        updateData.status = "LWP";
      }
    }
    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date: d },
      updateData,
      {
        upsert: true,
        new: true,
      }
    );
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
    const { employeeId, month, year } = req.query;

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0, 23, 59, 59, 999),
      },
    });

    let leaveCount = 0;
    let paidLeaveCount = 0;

    attendanceRecords.forEach((r) => {
      if (r.status === "Leave") {
        leaveCount++;
        if (r.isPaidLeave) paidLeaveCount++;
      }
    });

    return res.json({
      success: true,
      totalDays: attendanceRecords.length,
      leaveCount,
      paidLeaveCount,
      attendance: attendanceRecords,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server Error" });
  }
}
