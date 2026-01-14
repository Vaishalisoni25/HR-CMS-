import SalaryStructure from "../models/salaryStructure.model.js";
import mongoose from "mongoose";
import Employee from "../models/employee.model.js";
import { validationMonthYear } from "../utils/date.js";

function calculateSalaryStructure(totalSalary) {
  const round = (n) => Math.round(n * 100) / 100;
  const basicPay = round(totalSalary / 2);
  const hra = round(basicPay / 2);
  const specialAllowance = round(basicPay / 2);

  return {
    basicPay,
    HRA: hra,
    specialAllowance,
    grossSalary: round(totalSalary),
  };
}

export async function createSalaryStructure(req, res, next) {
  try {
    const {
      employeeId,
      month,
      year,
      grossSalary,
      startMonth,
      endMonth,
      status,
    } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee id is required" });
    }
    const employee = await Employee.findById(employeeId).select("name");

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    if (!grossSalary) {
      return res.status(400).json({ message: "grossSalary is required" });
    }

    const calculated = calculateSalaryStructure(grossSalary);

    const salaryStructure = await SalaryStructure.create({
      employeeId,
      name: employee.name,
      month,
      year,
      HRA: calculated.HRA,
      basicPay: calculated.basicPay,
      specialAllowance: calculated.specialAllowance,
      grossSalary: calculated.grossSalary,
      startMonth,
      endMonth,
      status,
    });
    await Employee.findByIdAndUpdate(employeeId, {
      salaryStructureId: salaryStructure._id,
    });
    res.status(201).json({
      success: true,
      message: "Salary created successfully",
      data: salaryStructure,
    });
  } catch (err) {
    next(err);
  }
}
export async function getSalaryStructure(_req, res, next) {
  try {
    const salaryStructure = await SalaryStructure.find().lean();
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
    const salaryId = req.params.id;
    if (!salaryId) {
      return res.status(400).json({ message: "Salary  Id required" });
    }

    const salaryStructure = await SalaryStructure.findById(salaryId);

    if (!salaryStructure) {
      return res.status(404).json({ message: "Salary Structure not found" });
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
export async function updateSalaryStructureById(req, res, next) {
  try {
    const salaryId = req.params.id;
    if (!salaryId) {
      return res.status(400).json({ message: "Salary Id required" });
    }
    const salaryStructure = await SalaryStructure.findByIdAndUpdate(
      salaryId,
      req.body,
      {
        new: true,
      }
    );

    if (!salaryStructure) {
      return res.status(404).json({ message: "Salary Structure not found" });
    }
    res.json({
      success: true,
      message: "Employee Salary Structure updated successfully",
      data: salaryStructure,
    });
  } catch (err) {
    next(err);
    return res.status(500), json({ message: "Salary Structure update denied" });
  }
}

export async function deleteSalaryStructureById(req, res, next) {
  try {
    const salaryId = req.params.id;
    if (!salaryId) {
      return res.status(400).json({ message: "Salary Structure Id required" });
    }

    const salaryStructure = await SalaryStructure.findByIdAndDelete(salaryId);

    if (!salaryStructure) {
      return res.status(401).json({ message: "Salary Structure not found" });
    }

    res.status(200).json({
      success: true,
      message: "Employee Salary Structure deleted successfully",
      data: salaryStructure,
    });
  } catch (err) {
    next(err);
    return (
      res.status(403), json({ message: "Salary Structure deleted denied" })
    );
  }
}
