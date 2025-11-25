import Employee from "../models/employee.model.js";
import { ROLES } from "../config/constant.js";

export async function createEmployee(req, res) {
  const employee = await Employee.create(req.body);
  res.status(201).json(employee);
}

export async function getEmployees(req, res) {
  const employees =
    req.user.role === ROLES.SUPERADMIN
      ? await Employee.find()
      : await Employee.find({ companyCode: req.user.companyCode });

  res.json(employees);
}

export async function getEmployeeById(req, res) {
  const employee = await Employee.findById(req.param.id);

  if (!employee) {
    return res.status(404).json({ msg: "Employee not found" });
  }
  res.json(employee);
}

export async function UpdateEmployeeById(req, res) {
  try {
    const emp = await Employee.findByIdAndUpdate(req.paeams.id, req.body, {
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
    const emp = await Employee.findByIdAndDelete(req.param.id);
    if (!emp) return res.status(404).json({ msg: "Employee not found" });

    res.json({ msg: "Employee Deleted successfully", emp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
