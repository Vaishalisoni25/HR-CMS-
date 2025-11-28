import leaveBalance from "../models/leave.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import { ROLES, ATTENDANCE_STATUSES, LEAVE_TYPES } from "../config/constant.js";
import mongoose from "mongoose";

export async function getLeaveBalance(req, res) {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      return res.status(400).json({ msg: "Employee ID is required" });
    }
    if (res.user.role !== ROLES.HR && req.user.role !== ROLES.SUPERADMIN) {
      if (req.user.id !== employeeId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const leave = await leaveBalance.findOne({ employeeId });
    if (!leave) {
      return res.status(404).json({ msg: "Leave balance not found" });
    }
    return res.json({
      employeeId,
      leaveBalance: {
        sick: leave.sick,
        privilege: leave.privilege,
        LWP: leave.LWP,
      },
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
}
