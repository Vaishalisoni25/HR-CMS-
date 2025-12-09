import Attendance from "../models/attendance.model.js";
import Employee from "../models/employee.model.js";
import { sendEmail } from "../services/email.service.js";
import { LEAVE_TYPES, ROLES } from "../config/constant.js";
import {
  formatFullDate,
  parseDate,
  validationMonthYear,
} from "../utils/dateGenerate.js";

export async function markAttendance(req, res) {
  try {
    if (![ROLES.HR, ROLES.SUPERADMIN].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only HR can mark attendance" });
    }
    const employeeId = req.params.id;
    const { date, status, leaveType } = req.body;
    console.log(req.body);

    if (!employeeId)
      return res.status(400).json({ msg: "Employee ID is required" });
    if (!date) return res.status(400).json({ msg: "Date is required" });
    if (!status) return res.status(400).json({ msg: "Status is required" });

    if (status === "Attended") {
      if (leaveType) {
        return res.status(400).json({
          msg: "Leave type is not allowed when status is present",
        });
      }
    }

    const formattedDate = formatFullDate(new Date());
    console.log(employeeId);

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    let updateData = {
      employeeId,
      date,
      status,
      leaveType: status === "Attended" ? null : leaveType || null,
    };

    if (status === "Leave") {
      if (employee.usedLeaves < employee.allowedLeaves) {
        employee.usedLeaves += 1;
        await employee.save();

        updateData.isPaidLeave = true;
        updateData.status = "Leave";

        //send email - approved leave
        const subject = `Leave Approved`;
        const htmlTemp = `
  
 <div style="font-family: Arial, sans-serif; padding: 20px;">
 
    <p>Dear <b>${employee.name}</b>,</p>
          <p>Your leave request has been <b>APPROVED</b>.</p>
          <p>Date: <b>${formattedDate}</b></p>
          <br/>
          <p>Best Regards,<br>HR Team</p>

     `;
        await sendEmail({
          to: employee.email,
          subject: "Your Leave is Approved",
          html: htmlTemp,
        });
      } else {
        updateData.isPaidLeave = false;
        updateData.status = "LWP";
      }
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employeeId, date },
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
    const { month, year } = req.body;
    const employeeId = req.params.id;

    console.log(req.body);
    if (!employeeId) {
      return res.status(400).json({ message: "Employee Id is required " });
    }

    const result = validationMonthYear(month, year);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    const { m, y, startDate, endDate } = result;

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
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
    return res.status(500).json({ msg: "Server Error", err });
  }
}
