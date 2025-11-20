const Employee = require("../models/employee.model");
const { ROLES } = require("../config/constant");

exports.createEmployee = async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).json(employee);
};

exports.getEmployees = async (req, res) => {
  const employees =
    req.user.role === ROLES.SUPERADMIN
      ? await Employee.find()
      : await Employee.find({ companyCode: req.user.companyCode });

  res.json(employees);
};

exports.getEmployeeById = async (req, res) => {
  const employee = await Employe.findById(req.param.id);

  if (!employee) {
    return res.status(404).json({ msg: "Employee not found" });
  }
  res.json(employee);
};

exports.UpdateEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.paeams.id, req.body, {
      new: true,
    });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    res.json({ msg: "Employee Updated successfully", emp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.param.id);
    if (!emp) return res.status(404).json({ msg: "Employee not found" });

    res.json({ msg: "Employee Deleted successfully", emp });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
