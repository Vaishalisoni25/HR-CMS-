import Attendance from "../models/attendance.model.js";
import Employee from "../models/employee.model.js";
import { sendEmail } from "../services/email.service.js";
import { ROLES, ATTENDANCE_STATUSES } from "../config/constant.js";
import { formatFullDate, validationMonthYear } from "../utils/date.js";
import { leaveEmailTemplate } from "../utils/emailTemplates.js";

export async function markAttendance(req, res) {
  try {
    if (![ROLES.HR, ROLES.SUPERADMIN].includes(req.user.role)) {
      return res.status(403).json({ msg: "Only HR can mark attendance" });
    }
    const employeeId = req.params.id;
    const { date, status, leaveType } = req.body;

    if (!employeeId)
      return res.status(400).json({ msg: "Employee ID is required" });
    if (!date) return res.status(400).json({ msg: "Date is required" });
    if (!status) return res.status(400).json({ msg: "Status is required" });

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    let updateData = {
      employeeId,
      date,
      status,
      leaveType:
        status === ATTENDANCE_STATUSES.ATTENDED ? null : leaveType || null,
    };

    const formattedDate = formatFullDate(new Date());
    let attendance;

    if (status === ATTENDANCE_STATUSES.ATTENDED) {
      attendance = await Attendance.findOneAndUpdate(
        { employeeId, date },
        updateData,
        { upsert: true, new: true }
      );
      return res.status(201).json({
        success: true,
        message: "Attendance marked",
        data: attendance,
      });
    }

    if (status === ATTENDANCE_STATUSES.LEAVE) {
      if (employee.usedLeaves < employee.allowedLeaves) {
        employee.usedLeaves += 1;
        await employee.save();

        updateData.isPaidLeave = true;
        updateData.status = ATTENDANCE_STATUSES.LEAVE;

        //send email - approved leave
        await sendEmail({
          to: employee.email,
          subject: "Your Leave is Approved",
          html: leaveEmailTemplate.approved({
            name: employee.name,
            date: formattedDate,
          }),
        });
      } else {
        updateData.isPaidLeave = false;
        updateData.status = ATTENDANCE_STATUSES.LWP;
      }
    }

    attendance = await Attendance.findOneAndUpdate(
      { employeeId, date },
      updateData,
      {
        upsert: true,
        new: true,
      }
    );
    return res.status(201).json({
      success: true,
      message: "Leave marked",
      data: attendance,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// GET ATTENDANCE

export async function getAttendance(req, res, _next) {
  try {
    const { month, year } = req.body;
    const employeeId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee Id is required " });
    }

    const result = validationMonthYear(month, year);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const { startDate, endDate } = result;

    const attendanceRecords = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    let leaveCount = 0;
    let paidLeaveCount = 0;

    attendanceRecords.forEach((r) => {
      if (r.status === "") {
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
    _next(err);
  }
}
