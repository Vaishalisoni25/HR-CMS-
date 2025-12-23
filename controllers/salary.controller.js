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
import SalaryStructure from "../models/salaryStructure.model.js";
import OtherAdjustment from "../models/otherAdjustment.model.js";

export async function generateSalary(req, res) {
  try {
    const employeeId = req.params.id;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee id is required" });
    }

    const { month, year, overtime = 0, bonus = 0 } = req.body;
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    // ----- validate month and year --------

    const validation = validationMonthYear(month, year);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { m, y, startDate, endDate } = validation;

    const salaryStructure = await SalaryStructure.findOne({
      employeeId,
      status: SALARY_STRUCTURE_STATUS.ACTIVE,
    });
    if (!salaryStructure) {
      return res.status(400).json({ message: "Salary Structure not found" });
    }

    const basicSalary = salaryStructure.basicPay;

    if (!basicSalary) {
      return res.status(404).json({ message: " Basic Salary not found" });
    }

    // ---------Other Adjustment --------

    const adjustment = await OtherAdjustment.find({
      employeeId,
      month: m,
      year: y,
    });

    const totalAdjustment = adjustment.reduce((sum, adj) => {
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
    const leaveEncashment = paidLeaveCount * perDaySalary;

    const earnings = {
      [SALARY_COMPONENT.BASIC_SALARY]: basicSalary,
      [SALARY_COMPONENT.OVERTIME]: overtime,
      [SALARY_COMPONENT.BONUS]: bonus,
      [SALARY_COMPONENT.LEAVE_ENCASHMENT]: leaveEncashment,
      [SALARY_COMPONENT.OTHER_ADJUSTMENTS]: totalAdjustment,
    };
    const round = (n) => Math.round(n * 100) / 100;
    //-------Total Earnings-------
    const totalEarning =
      earnings[SALARY_COMPONENT.BASIC_SALARY] +
      earnings[SALARY_COMPONENT.OVERTIME] +
      earnings[SALARY_COMPONENT.BONUS] +
      earnings[SALARY_COMPONENT.LEAVE_ENCASHMENT] +
      earnings[SALARY_COMPONENT.OTHER_ADJUSTMENTS];
    // -------- TDS (10%) ----------
    const tds = round(totalEarning * 0.1);

    //-----PT------------------

    let professionalTax = 0;

    if (totalEarning <= 18750) {
      professionalTax = 0;
    } else if (totalEarning <= 25000) {
      professionalTax = 125;
    } else if (totalEarning <= 33333) {
      professionalTax = 167;
    } else {
      // Professional Tax: ₹208 for 11 months, ₹212 in March (last month of FY)
      professionalTax = m === 3 ? 212 : 208;
    }

    const deductions = {
      [SALARY_COMPONENT.TDS]: tds,
      [SALARY_COMPONENT.PROFESSIONAL_TAX]: professionalTax,
      [SALARY_COMPONENT.PF]: basicSalary * 0.12,
      [SALARY_COMPONENT.LWP_DEDUCTION]: lwpDeduction,
    };

    //---------- total deduction---------

    const totalDeduction =
      deductions[SALARY_COMPONENT.PF] +
      deductions[SALARY_COMPONENT.TDS] +
      deductions[SALARY_COMPONENT.PROFESSIONAL_TAX] +
      deductions[SALARY_COMPONENT.LWP_DEDUCTION];

    const netSalary = round(totalEarning - totalDeduction);
    // const existingSalary = await Salary.findOne({
    //   employeeId,
    //   month: m,
    //   year: y,
    // });
    // if (existingSalary) {
    //   return res
    //     .status(400)
    //     .json({ message: "Salary already generated for this month" });
    // }

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

export async function getSalaryById(req, res) {
  try {
    const employeeId = req.params.id;
    const { month, year } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee Id is required" });
    }
    const validation = validationMonthYear(month, year);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { m, y } = validation;

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
export async function getAllSalary(req, res, next) {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required" });
    }
    const validation = validationMonthYear(month, year);

    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const { m, y } = validation;
    const salary = await Salary.find({
      month: m,
      year: y,
    }).lean();
    res.status(200).json({
      success: true,
      message: " All Salaries fetched successfully",
      data: salary,
    });
  } catch (err) {
    next(err);
  }
}
