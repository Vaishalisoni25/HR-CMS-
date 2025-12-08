import Salary from "../models/salary.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import { SALARY_STATUS } from "../config/constant.js";
import mongoose from "mongoose";
import { ROLES } from "../config/constant.js";
import { sendEmail } from "../services/email.service.js";
import { formatFullDate } from "../utils/dateGenerate.js";

export async function generateSalary(req, res) {
  try {
    const employeeId = req.params.id;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee id is required" });
    }
    const {
      month,
      year,
      overtime = 0,
      bonus = 0,
      otherAdjustment = 0,
    } = req.body;

    if (!month || !year) {
      return res.status(400).json({ message: "month and year are required" });
    }
    const employee = await Employee.findById(employeeId);

    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    const basicSalary = employee.basicSalary;

    //per day salry
    const dayInMonth = new Date(year, month, 0).getDate();
    const perDaySalary = basicSalary / dayInMonth;

    // Get Attendance of selected month
    const attendanceRecords = await Attendance.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
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
      TDS: 0,
      PF: basicSalary * 0.12,
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

    const salary = await Salary.create({
      employeeId,
      month,
      year,
      earnings,
      deductions,
      netSalary,
    });

    const formattedDate = formatFullDate(new Date());

    const subject = `Salary Slip for ${month}-${year}`;
    const html = `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color:#2d89ef;">Salary Slip - ${formattedDate}</h2>

    <p>Dear <b>${employee.name}</b>,</p>

    <p>Your salary for the month of <b>${formattedDate}</b> has been successfully processed.</p>

    <h3 style="color:#444;">Earnings</h3>
    <ul>
      <li><b>Basic Salary:</b> ₹${earnings.basicSalary.toFixed(2)}</li>
      <li><b>Bonus:</b> ₹${earnings.bonus.toFixed(2)}</li>
      <li><b>Overtime:</b> ₹${earnings.overtime.toFixed(2)}</li>
      <li><b>Paid Leave Encashment:</b> ₹${earnings.leaveEncashment.toFixed(
        2
      )}</li>
      <li><b>Other Adjustments:</b> ₹${earnings.otherAdjustment.toFixed(2)}</li>
    </ul>

    <h3 style="color:#444;">Deductions</h3>
    <ul>
      <li><b>PF (12%):</b> ₹${deductions.PF.toFixed(2)}</li>
      <li><b>LWP Deduction:</b> ₹${deductions.lwpDeduction.toFixed(2)}</li>
      <li><b>TDS:</b> ₹${deductions.TDS.toFixed(2)}</li>
    </ul>

    <h2 style="color:green;">Net Salary: ₹${netSalary.toFixed(2)}</h2>

    <br>
    <p>Best Regards,<br><b>HR Team</b></p>
  </div>
`;
    await sendEmail({
      to: employee.email,
      subject: "Your Salary is generated",
      html: html,
    });
    return res.status(201).json({
      message: "Salary generated successfully",
      data: salary,
    });
  } catch (err) {
    console.error(err);
    console.log(err);
    return res.status(500).json({ message: "Server Error", err });
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
    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required" });
    }

    const m = Number(month);
    const y = Number(year);

    if (isNaN(m) || isNaN(y) || m < 1 || m > 12) {
      return res.status(400).json({ message: "Invalid month or year" });
    }

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
