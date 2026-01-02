import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import { validationMonthYear } from "../utils/date.js";
import Salary from "../models/salary.model.js";
import mongoose from "mongoose";
export async function generateEmployeeSummary(req, res, next) {
  try {
    const employeeId = req.params.id;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee id is required" });
    }
    const { month, year } = req.query;

    const employee = await Employee.findById(employeeId).lean();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const matchCondition = {
      employeeId: new mongoose.Types.ObjectId(employeeId),
    };

    if (month && year) {
      const { m, y, error } = validationMonthYear(month, year);
      if (error) {
        return res.status(400).json({ message: error });
      }

      matchCondition.$expr = {
        $and: [
          { $eq: [{ $month: "$date" }, m] },
          { $eq: [{ $year: "$date" }, y] },
        ],
      };
    }

    const attendance = await Attendance.aggregate([
      {
        $match: matchCondition,
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const attendanceSummary = {
      attended: 0,
      leave: 0,
      lwp: 0,
    };

    attendance.forEach((a) => {
      attendanceSummary[a._id] = a.count;
    });

    const latestSalary = await Salary.findOne({ employeeId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        employee: {
          name: employee.name,
          email: employee.email,
          role: employee.role,
          status: employee.status,
        },
        attendanceSummary,
        salary: latestSalary
          ? {
              month: latestSalary.month,
              year: latestSalary.year,
              netSalary: latestSalary.netSalary,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeSummaryById(req, res, next) {
  try {
    const employeeId = req.params.id;

    const employee = await Employee.findById({ employeeId }).lean();
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const latestSalary = await Salary.findOne({ employeeId })
      .sort({ created: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      message: "Employee summary fetched successfully",
      data: {
        employee: {
          name: employee.name,
          email: employee.email,
          role: employee.role,
          status: employee.status,
        },
        attendanceSummary,
        salary: latestSalary
          ? {
              month: latestSalary.month,
              year: latestSalary.year,
              netSalary: latestSalary.netSalary,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
}
