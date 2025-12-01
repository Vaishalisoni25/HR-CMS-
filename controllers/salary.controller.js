import Salary from "../models/salary.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import { SALARY_STATUS } from "../config/constant.js";
import mongoose from "mongoose";
import { ROLES } from "../config/constant.js";

export async function generateSalary(req, res) {
  try {
    const {
      employeeId,
      month,
      year,
      overtime = 0,
      bonus = 0,
      otherAdjustment = 0,
    } = req.body;

    if (!employeeId || !month || !year) {
      return res
        .status(400)
        .json({ message: "employeeId, month and year are required" });
    }
    const employee = await Employee.findById(employeeId);

    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    const basicSalary = employee.basicSalary;

    //per day salry
    const dayInMonth = new Date(year, month, 0).getDate();
    const perDaySalary = basicSalary / dayInMonth;

    // Get Attendance of selected month
    const attendanceRecords = await Attendance.find({
      employeeId: mongoose.Types.ObjectId(employeeId),
      date: {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0, 23, 59, 59, 999),
      },
    });

    const { leaveCount, paidLeaveCount } = attendanceRecords.reduce(
      (acc, record) => {
        if (record.status === "Leave") {
          acc.leaveCount++;
          if (record.isPaidLeave) acc.paidLeaveCount++;
        }
        return acc;
      },
      { leaveCount: 0, paidLeaveCount: 0 }
    );

    const lwpDeduction = (leaveCount - paidLeaveCount) * perDaySalary;

    const earnings = {
      basicSalary,
      overtime,
      bonus,
      leaveEncashment: paidLeaveCount * perDaySalary,
      otherAdjustment,
    };

    const deductions = {
      TDS: 100,
      PF: 100,
      lwpDeduction,
    };

    const totalEarning =
      earnings.basicSalary +
      earnings.overtime +
      earnings.bonus +
      earnings.leaveEncashment +
      earnings.otherAdjustment;

    // total deduction
    const totalDeduction =
      deductions.PF + deductions.TDS + deductions.lwpDeduction;

    const netSalary = totalEarning - totalDeduction;

    const salary = await salary.create({
      employeeId,
      month,
      year,
      earnings,
      deductions,
      netSalary,
    });
    return res.status(201).json({
      message: "Salary generated successfully",
      salary,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", err });
  }
}
//get salary records

export async function getSalary(req, res) {
  try {
    const user = req.user;
    let filter = {};

    if (![ROLES.HR, ROLES.SUPERADMIN].includes(user.role)) {
      filter.employeeId = user.id;
    }
    if (req.query.employeeId) {
      filter.employeeId = req.query.employeeId;
    }
    if (req.query.employeeId) {
      filter.employeeId = req.query.employeeId;
    }
    const { month, year } = req.query;
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const salaries = await Salary.find(filter);
    return res.json(salaries);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
}
