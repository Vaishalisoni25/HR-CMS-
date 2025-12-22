import Employee from "../models/employee.model.js";
import { ROLES } from "../config/constant.js";
import { customError } from "../utils/customError.js";
import { generateCode } from "../utils/generateCode.js";
import { sendEmail } from "../services/email.service.js";
import { formatFullDate } from "../utils/date.js";
import { employeeEmailTemplate } from "../utils/emailTemplates.js";

export async function createEmployee(req, res, next) {
  try {
    const { email } = req.body;

    const exists = await Employee.findOne({ email });
    if (exists) {
      return next(new customError("Email already exist", 400));
    }
    const loginPassword = generateCode();

    const employee = await Employee.create(req.body);
    const formattedDate = formatFullDate(new Date());
    //send code to employee

    await sendEmail({
      to: employee.email,
      subject: "Welcome to company",
      html: employeeEmailTemplate.created({
        name: employee.name,
        date: formattedDate,
        email,
        loginPassword,
      }),
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEmployees(_req, res, next) {
  try {
    const employees = await Employee.find().lean();
    res.json({
      succcess: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeById(req, res, next) {
  try {
    const empId = req.params.id;

    if (!empId) {
      return next(new customError("Employee ID is required", 400));
    }

    if (req.user.role === ROLES.EMPLOYEE && req.user.id !== empId) {
      return next(new customError("Access denied", 403));
    }

    const employee = await Employee.findById(empId);
    if (!employee) {
      return next(new customError("Employee not found", 404));
    }

    res.json({
      success: true,
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateEmployeeById(req, res, next) {
  try {
    const empId = req.params.id;

    if (!empId) {
      return next(new customError("Employee ID is required", 400));
    }

    const emp = await Employee.findByIdAndUpdate(empId, req.body, {
      new: true,
    });

    if (!emp) {
      return next(new customError("Employee not found", 404));
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: emp,
    });
  } catch (err) {
    return res.status(403).json({ message: "Employee update denied" });
  }
}

export async function deleteEmployeeById(req, res, next) {
  try {
    const empId = req.params.id;

    if (!empId) {
      return next(new customError("Employee ID is required", 400));
    }

    const emp = await Employee.findByIdAndDelete(empId);

    if (!emp) {
      return next(new customError("Employee not found", 404));
    }

    res.json({
      success: true,
      message: "Employee deleted successfully",
      data: emp,
    });
  } catch (err) {
    return res.status(400).json({ message: "Employee deletion denied" });
  }
}
