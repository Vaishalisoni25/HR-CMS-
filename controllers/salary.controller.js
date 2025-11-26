import Salary from "../models/salary.model.js";
import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import { ROLES, SALARY_STATUS } from "../config/constant.js";

export async function generateSalary(req, res) {
  try {
    const { employeeId, month, year, basicSalary, bonus } = req.body;

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
    const dayInMonth = new Date(year, month, 0).getDate();
    const perDaySalary = basicSalary / dayInMonth;

    const salary = await Salary.create({
      employeeId,
      month,
      year,
      basicSalary,
      bonus,

      deduction: {
        LWP: LWPdeduction,
      },
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
    let filter = {};

    // EMPLOYEE → Only own salary
    if (req.user.role !== ROLES.HR && req.user.role !== ROLES.SUPERADMIN) {
      filter.employeeId = req.user.id;
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
