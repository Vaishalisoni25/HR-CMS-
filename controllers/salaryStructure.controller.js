import Salary_Structure from "../models/salaryStructure.model.js";
import mongoose from "mongoose";
import Employee from "../models/employee.model.js";
import { validationMonthYear } from "../utils/date.js";

export async function createSalaryStructure(req, res, next) {
  try {
    const {
      employeeId,
      month,
      year,
      HRA,
      basicPay,
      specialAllowance,
      grossSalary,
      effectiveFrom,
      effectiveTo,
      status,
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee id is required" });
    }
    const employee = await Employee.findById(employeeId);

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const finalGrossSalary = basicPay + HRA + specialAllowance;

    const salarystructure = await Salary_Structure.create({
      employeeId,
      month,
      year,
      HRA,
      basicPay,
      specialAllowance,
      grossSalary: finalGrossSalary,
      effectiveFrom,
      effectiveTo,
      status,
    });
    res.status(201).json({
      success: true,
      message: "Salary created successfully",
      data: salarystructure,
    });
  } catch (err) {
    next(err);
  }
}
export async function getSalaryStructure(_req, res, next) {
  try {
    const salaryStructure = await Salary_Structure.find().lean();
    if (!salaryStructure) {
      return res.status(404).json({ message: "Salary Structure not found " });
    }
    res.json({
      success: true,
      message: "Salary Structure fetched successfully",
      data: salaryStructure,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSalaryStructureById(req, res, next) {
  try {
    const employeeId = req.params.id;
    if (!employeeId) {
      return next(new customError("Employee ID is required", 400));
    }

    const salaryStructure = await Salary_Structure.findById(employeeId);

    if (!salaryStructure) {
      return next(new customError("Salary Structure is required", 404));
    }
    res.json({
      success: true,
      message: "Employee Salary Structure fetched successfully",
      data: salaryStructure,
    });
  } catch (err) {
    next(err);
  }
}
