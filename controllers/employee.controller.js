import Employee from "../models/employee.model.js";
import bcrypt from "bcrypt";
import { ROLES } from "../config/constant.js";
import { customError } from "../utils/customError.js";
import { success } from "zod";
import { generateCode } from "../utils/generateCode.js";
import { sendEmail } from "../services/email.service.js";

export async function createEmployee(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      joiningDate,
      position,
      employmentType,
      companyCode,
    } = req.body;

    const exists = await Employee.findOne({ email });
    if (exists) {
      return next(new customError("Email already exist", 400));
    }
    const loginPassword = generateCode();
    const password = await bcrypt.hash("123qwe", 10);

    const employee = await Employee.create({
      name,
      email,
      password,
      phone,
      joiningDate,
      position,
      companyCode,
      employmentType,
      status: "Active",
      basicSalary,
    });
    //send code to employee

    const htmlTemplate = `
        <h2>Welcome to Company</h2>
        <p>Dear <b>${name}</b>,</p>
        <p>Your employee account has been created.</p>
        <p><b>Login Email:</b> ${email}</p>
        <p><b>Your Password:</b> ${loginPassword}</p>

        <p>Login hare... <p/>
        <p>Regard,<br>HR Team</p>
        
        `;
    await sendEmail(email, "login credentials", htmlTemplate);

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (err) {
    next(err);
    res.status(400).json({ message: err.message });
  }
}

export async function getEmployees(req, res, next) {
  try {
    const employees = await Employee.find();
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
