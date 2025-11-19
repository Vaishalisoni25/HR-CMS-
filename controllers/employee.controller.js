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
