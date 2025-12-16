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
import Other_Adjustment from "../models/otherAdjustment.model.js";

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

    const { m, y, startDate, endDate } = result;

    const salaryStructure = await Salary_Structure.findOne({
      employeeId,
      status: SALARY_STRUCTURE_STATUS.ACTIVE,
    });
    if (!salaryStructure) {
      return res.status(400).json({ message: "Salary Structure not found" });
    }

    const basicSalary = salaryStructure.basicPay;

    // ---------Other Adjustment --------

    const adjustments = await Other_Adjustment.find({
      employeeId,
      month: m,
      year: y,
    });

    const totalAdjustment = adjustments.reduce((sum, adj) => {
      return adj.type === "ADD" ? sum + adj.amount : sum - adj.amount;
    }, 0);

    //------------per day salry------------

    const dayInMonth = new Date(y, m, 0).getDate();
    const perDaySalary = basicSalary / dayInMonth;

    // -----------Get Attendance of selected month --------

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

    //---------Earnings--------------

    const earnings = {
      [SALARY_COMPONENT.BASIC_SALARY]: basicSalary,
      [SALARY_COMPONENT.OVERTIME]: overtime,
      [SALARY_COMPONENT.BONUS]: bonus,
      leaveEncashment: paidLeaveCount * perDaySalary,
      adjustment: totalAdjustment,
    };

    //-------Total Earnings-------
    const totalEarning =
      earnings[SALARY_COMPONENT.BASIC_SALARY] +
      earnings[SALARY_COMPONENT.OVERTIME] +
      earnings[SALARY_COMPONENT.BONUS] +
      earnings.leaveEncashment +
      earnings.adjustment;

    const tds = totalEarning * 0.1;

    //-----PT------------------

    let professionalTax = 0;

    if (totalEarning <= 18750) {
      professionalTax = 0;
    } else if (totalEarning <= 25000) {
      professionalTax = 125;
    } else if (totalEarning <= 33333) {
      professionalTax = 167;
    } else {
      professionalTax = m === 3 ? 212 : 208; // March = last month
    }

    const deductions = {
      [SALARY_COMPONENT.TDS]: tds,
      professionalTax,
      [SALARY_COMPONENT.PF]: basicSalary * 0.12,
      [SALARY_COMPONENT.LWP_DEDUCTION]: lwpDeduction,
    };

    //---------- total deduction---------

    const totalDeduction =
      deductions[SALARY_COMPONENT.PF] +
      deductions[SALARY_COMPONENT.TDS] +
      deductions.professionalTax +
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
      success: true,
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
