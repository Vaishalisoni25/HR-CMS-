import Employee from "../models/employee.model.js";
import Attendance from "../models/attendance.model.js";
import Salary from "../models/salary.model.js";
import { validationMonthYear } from "../utils/date.js";

export async function employeeReport(req, res, next) {
  try {
    const { month, year } = req.query;

    let newEmployeesThisMonth = 0;

    if (month && year) {
      const { startDate, endDate, error } = validationMonthYear(month, year);

      if (error) {
        return res.status(400).json({ success: false, message: error });
      }

      newEmployeesThisMonth = await Employee.countDocuments({
        joiningDate: { $gte: startDate, $lte: endDate },
      });
    }

    const typeCounts = await Employee.aggregate([
      {
        $group: {
          _id: "$employmentType",
          count: { $sum: 1 },
        },
      },
    ]);
    const employmentTypeBreakdown = {
      FULL_TIME: 0,
      PART_TIME: 0,
      INTERN: 0,
    };

    typeCounts.forEach((item) => {
      employmentTypeBreakdown[item._id] = item.count;
    });

    const activeEmployees = await Employee.countDocuments({ status: "Active" });
    const inactiveEmployees = await Employee.countDocuments({
      status: "Inactive",
    });

    const totalEmployees = activeEmployees + inactiveEmployees;

    return res.json({
      success: true,
      message: "Employee report generated",
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        employmentTypeBreakdown,
        newEmployeesThisMonth,
      },
    });
  } catch (err) {
    next(err);
  }
}
