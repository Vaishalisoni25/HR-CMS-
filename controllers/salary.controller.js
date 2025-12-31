import Salary from "../models/salary.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import mongoose from "mongoose";
import {
  ATTENDANCE_STATUSES,
  SALARY_COMPONENT,
  SALARY_STATUS,
  SALARY_STRUCTURE_STATUS,
} from "../config/constant.js";
import { sendEmail } from "../services/email.service.js";
import { formatFullDate, validationMonthYear } from "../utils/date.js";
import { salaryEmailTemplate } from "../utils/emailTemplates.js";
import Salary_Structure from "../models/salaryStructure.model.js";

export async function generateSalary(req, res) {
  try {
    const employeeId = req.params.id;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee id is required" });
    }
    const { month, year, overtime = 0, bonus = 0 } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    const result = validationMonthYear(month, year);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const { m, y, startDate, endDate, error } = result;

    const salaryStructure = await Salary_Structure.findOne({
      employeeId,
      status: SALARY_STRUCTURE_STATUS.ACTIVE,
    });
    if (!salaryStructure) {
      return res.status(400).json({ message: "Salary Structure not found" });
    }

    const basicSalary = salaryStructure.basicPay;

    const adjustment = await otherAdjustment.find({
      employeeId,
      month: m,
      year: y,
    });

    const totalAdjustment = otherAdjustment.reduce((sum, ad) => {
      return adj.type === "ADD" ? sum + adj.amount : sum - adj.amount;
    }, 0);

    earnings.otherAdjustment = totalAdjustment;

    //per day salry
    const dayInMonth = new Date(y, m, 0).getDate();
    const perDaySalary = basicSalary / dayInMonth;

    // Get Attendance of selected month
    const attendanceRecords = await Attendance.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const { leaveCount, paidLeaveCount } = attendanceRecords.reduce(
      (acc, record) => {
        if (record.status === ATTENDANCE_STATUSES.LEAVE) {
          acc.leaveCount++;
          if (record.isPaidLeave) acc.paidLeaveCount++;
        }
        return acc;
      },
      { leaveCount: 0, paidLeaveCount: 0 }
    );

    const lwpDeduction = (leaveCount - paidLeaveCount) * perDaySalary;

    const earnings = {
      [SALARY_COMPONENT.BASIC_SALARY]: basicSalary,
      [SALARY_COMPONENT.OVERTIME]: overtime,
      [SALARY_COMPONENT.BONUS]: bonus,
      leaveEncashment: paidLeaveCount * perDaySalary,
      otherAdjustment,
    };

    const deductions = {
      [SALARY_COMPONENT.TDS]: 0,
      [SALARY_COMPONENT.PF]: basicSalary * 0.12,
      [SALARY_COMPONENT.LWP_DEDUCTION]: lwpDeduction,
    };

    const totalEarning =
      earnings[SALARY_COMPONENT.BASIC_SALARY] +
      earnings[SALARY_COMPONENT.OVERTIME] +
      earnings[SALARY_COMPONENT.BONUS] +
      earnings.leaveEncashment +
      earnings.otherAdjustment;

    // total deduction
    const totalDeduction =
      deductions[SALARY_COMPONENT.PF] +
      deductions[SALARY_COMPONENT.TDS] +
      deductions[SALARY_COMPONENT.LWP_DEDUCTION];

    const netSalary = totalEarning - totalDeduction;

    const salary = await Salary.create({
      employeeId,
      month: m,
      year: y,
      earnings,
      deductions,
      netSalary,
      status: SALARY_STATUS.GENERATED,
    });

    const formattedDate = formatFullDate();

    await sendEmail({
      to: employee.email,
      subject: "Your Salary is generated",
      html: salaryEmailTemplate.generated({
        name: employee.name,
        date: formattedDate,
        earnings,
        deductions,
        netSalary,
      }),
    });
    return res.status(201).json({
      message: "Salary generated successfully",
      data: salary,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server Error",
      error: err?.message || err,
      stack: err?.stack,
    });
  }
}
//get salary records

export async function getSalary(req, res) {
  try {
    const employeeId = req.params.id;
    const { month, year } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee Id is required" });
    }
    const result = validationMonthYear(month, year);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const { m, y } = result;

    // ----- Find salary -----
    const salary = await Salary.findOne({
      employeeId,
      month: m,
      year: y,
    });

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    return res.status(200).json({
      success: true,
      data: salary,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server Error", err });
  }
}
