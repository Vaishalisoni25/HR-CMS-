import Employee from "../models/employee.model.js";
import bcrypt from "bcrypt";
import { ROLES } from "../config/constant.js";

export async function createEmployee(req, res) {
  try {
    // Only HR or superadmin
    if (req.user.role !== ROLES.HR && req.user.role !== ROLES.SUPERADMIN) {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      name,
      email,
      password,
      phone,
      joiningDate,
      department,
      companyCode,
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashed,
      phone,
      joiningDate,
      department,
      companyCode,
      status: "Active",
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getEmployees(req, res) {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getEmployeeById(req, res) {
  try {
    const empId = req.params.id;

    if (!empId)
      return res.status(400).json({ message: "Employee ID is required" });

    const employee = await Employee.findById(empId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function UpdateEmployeeById(req, res) {
  try {
    const empId = req.params.id;

    if (!empId)
      return res.status(400).json({ message: "Employee ID is required" });

    const emp = await Employee.findByIdAndUpdate(empId, req.body, {
      new: true,
    });

    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee updated successfully", emp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteEmployeeById(req, res) {
  try {
    const empId = req.params.id;

    if (!empId)
      return res.status(400).json({ message: "Employee ID is required" });

    const emp = await Employee.findByIdAndDelete(empId);

    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json({ message: "Employee deleted successfully", emp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
