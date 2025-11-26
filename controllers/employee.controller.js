import Employee from "../models/employee.model.js";
import { ROLES } from "../config/constant.js";
import bcrypt from "bcrypt";

export async function createEmployee(req, res) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: ROLES.EMPLOYEE,
    });
    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (err) {
    return res.status(404).json({ msg: "Employee not created" });
  }
}

export async function getEmployees(req, res) {
  try {
    const employees = await User.find({ role: ROLES.EMPLOYEE });
    res.json(employees);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getEmployeeById(req, res) {
  try {
    const empId = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const employee = await Employee.findById(empId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function UpdateEmployeeById(req, res) {
  try {
    const empId = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const emp = await Employee.findByIdAndUpdate(empId, req.body, {
      new: true,
    });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json({ msg: "Employee Updated successfully", emp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteEmployeeById(req, res) {
  try {
    const empId = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const emp = await Employee.findByIdAndDelete(empId);
    if (!emp) return res.status(404).json({ msg: "Employee not found" });

    res.json({ msg: "Employee Deleted successfully", emp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
