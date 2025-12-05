import Salary from "../models/salary.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import { ROLES, SALARY_STATUS } from "../config/constant.js";

export async function generateSalary(req, res) {
  try {
    const { employeeId, month, year, earnings, deductions } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    //count LWP days in this month

    const LWPDays = await Attendance.countDocuments({
      employeeId,
      status: "LWP",
      date: {
        $gte: new Date(year, month - 1, 1),
        $lte: new Date(year, month, 0),
      },
    });
    //per day salry
    const dayInMonth = new Date(year, month, 0).getDate();
    const perDaySalary = basicSalary / dayInMonth;

    const salary = await Salary.create({
      employeeId,
      month,
      year,

      deduction: {},
      salary,
      status: SALARY_STATUS.GENERATED,
    });
    return res.status(201).json({
      msg: "Salary Generated Successfully",
      salary,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: "Can't Generate Salary", error: err.message });
  }
}
//get salary records

export async function getSalary(req, res) {
  try {
    const requestedId = req.params.id; // salary for which employee?

    let filter = {};

    if (req.user.role === ROLES.EMPLOYEE) {
      // employee can only view their own salary
      if (requestedId !== req.user.id) {
        return res.status(403).json({ msg: "Access denied" });
      }
      filter.employeeId = req.user.id;
    } else {
      // HR / SUPERADMIN can view any employee salary
      if (requestedId) filter.employeeId = requestedId;
    }
    const salaries = await Salary.find(filter).populate(
      "employeeId",
      "name email"
    );

    return res.json(salaries);
  } catch (err) {
    return res.status(500).json({
      msg: "Can't get Salary",
      error: err.message,
    });
  }
}

//salary update by HR/Superadmin

export async function updateSalary(req, res) {
  try {
    if (![ROLES.HR, ROLES.SUPERADMIN].includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    const id = req.params.id;
    const updates = req.body;

    const salary = await salary.findByIdandUpdate(id, updates, { new: true });

    if (!salary) {
      return res.status(404).json({ msg: "salary record not found" });
    }
    res.json({ msg: "Salary updated successfully", salary });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}
