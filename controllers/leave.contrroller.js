import Leave from "../models/leave.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import { ROLES, ATTENDANCE_STATUSES, LEAVE_TYPES } from "../config/constant.js";

// --- countDaysInclusive ---
const countDaysInclusive = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);

  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);

  const diffMs = e - s;
  return Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
};

//  APPLY LEAVE

export async function applyLeave(req, res) {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const employeeId = req.user.id;

    // Validate leaveType with constant file
    if (!Object.values(LEAVE_TYPES).includes(leaveType)) {
      return res.status(400).json({ msg: "Invalid leaveType." });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (to < from)
      return res.status(400).json({ msg: "toDate must be >= fromDate" });

    // --- Check overlapping approved leaves ---
    const overlapping = await Leave.findOne({
      employeeId,
      status: "APPROVED",
      $or: [{ fromDate: { $lte: to }, toDate: { $gte: from } }],
    });

    if (overlapping) {
      return res.status(400).json({ msg: "Overlapping approved leave exists" });
    }

    const totalDays = countDaysInclusive(from, to);

    const leave = new Leave({
      employeeId,
      leaveType,
      fromDate: from,
      toDate: to,
      totalDays,
      reason,
      status: "PENDING",
    });

    await leave.save();
    return res.status(201).json({ msg: "Leave applied", leave });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

//  GET LEAVES

export async function getLeaves(req, res) {
  try {
    const user = req.user;
    let filter = {};

    if (user.role !== ROLES.SUPERADMIN && user.role !== ROLES.HR) {
      filter.employeeId = user.id;
    }

    const leaves = await Leave.find(filter).populate(
      "employeeId",
      "name email"
    );

    return res.json(leaves);
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}

//  APPROVE / REJECT LEAVE

export async function handleApproval(req, res) {
  try {
    const user = req.user; // FIXED: res.user → req.user

    if (![ROLES.HR, ROLES.SUPERADMIN].includes(user.role)) {
      return res.status(403).json({ msg: "Access Denied" });
    }

    const leaveId = req.params.id;
    const { status } = req.body;

    const leave = await Leave.findById(leaveId); // FIXED Leave.findById
    if (!leave) return res.status(404).json({ msg: "Leave not found" });

    // FIXED spacing "!=="
    if (leave.status !== "PENDING") {
      return res
        .status(400)
        .json({ msg: "Only pending leaves can be approved/rejected" });
    }

    //  REJECT
    if (status === "REJECTED") {
      leave.status = "REJECTED";
      leave.approvedBy = user.id;
      await leave.save();
      return res.json({ msg: "Leave rejected", leave });
    }

    // APPROVE
    if (status === "APPROVED") {
      const employee = await Employee.findById(leave.employeeId);
      if (!employee) return res.status(404).json({ msg: "Employee not found" });

      // --- LWP Salary Deduction ---
      let deduction = 0;
      if (leave.leaveType === LEAVE_TYPES.LWP) {
        const salary = employee.basicSalary || employee.salary || 0;
        const perDay = salary / 30;
        deduction = perDay * leave.totalDays;
      }

      leave.status = "APPROVED";
      leave.approvedBy = user.id;
      leave.payrollDeduction = deduction;

      await leave.save();

      // Create Attendance Entries

      for (let i = 0; i < leave.totalDays; i++) {
        const d = new Date(leave.fromDate);
        d.setDate(d.getDate() + i);
        d.setHours(0, 0, 0, 0);

        await Attendance.findOneAndUpdate(
          { employeeId: leave.employeeId, date: d },
          {
            employeeId: leave.employeeId,
            date: d,
            status:
              leave.leaveType === LEAVE_TYPES.LWP
                ? ATTENDANCE_STATUSES.LWP
                : ATTENDANCE_STATUSES.LEAVE,
            leaveType: leave.leaveType,
          },
          { upsert: true, new: true }
        );
      }

      return res.json({ msg: "Leave approved", leave });
    }

    return res.status(400).json({ msg: "Invalid status value" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", error: err.message });
  }
}
