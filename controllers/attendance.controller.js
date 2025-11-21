const Attendance = require("../models/attendance.model");
const { ROLES } = require("../config/constant");
const Employee = require("../models/employee.model");

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status, LeaveType, isPaidleave } = req.body;
    //fetch employee data
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    //HR is marking a leave
    if (status === "Leave" && isPaidleave === true) {
      //check emp has remaining paid leaves
      if (employee.usedleaves >= employee.allowedLeaves) {
        return res.status(400).json({
          msg: "Employee has no remaining paid leaves",
        });
      }
    }

    //check if attendance already exist for this date
    let existing = await Attendance.findOne({ employeeId, date });
    if (existing) {
      if (
        status === "Leave" &&
        isPaidleave === true &&
        existing.isPaidLeave === false
      ) {
        if (employee.usedLeaves >= employee.allowedleaves) {
          return res.status(400).json({
            msg: "Employee has no remaining paid leaves",
          });
        }
        employee.usedLeaves += 1;
        await employee.save();
      }

      //if changing from paid leave to non paid
      if (
        existing.status === "Leave" &&
        existing.isPaidLeave === true &&
        ispaidLeave === false
      ) {
        employee.usedleaves -= 1;
        await employee.save();
      }

      existing.status = status;
      existing.leaveType = leaveType || null;
      existing.isPaidleave = isPaidleave;
      await existing.save();

      return res.json({ msg: "Attendance updated", data: existing });

      //Create new attendance
      const record = await Attendance.create({
        employeeId,
        date,
        status,
        leaveType: LeaveType || null,
        isPaidLeave,
      });

      // count paid leave
      if (status === "Leave" && ispaidLleave === true) {
        employee.usedleaves += 1;
        await employee.save();
      }
      return res.status(201).json({
        msg: "Attendance marked",
        data: record,
      });
    }
  } catch (err) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  const filter =
    req.user.role === ROLES.HR ? { companyCode: req.user.companyCode } : {};
  const attendance = await Attendance.find(filter).populate("employeeId");
  res.json(attendance);
};
