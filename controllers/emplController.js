const { validationResult } = require("express-validator");
const Employee = require("../models/Employee");
const { message } = require("statuses");

exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return;
  res.status(400).json({ errors: errors.array() });

  const { empId, name, email, phone, department, joiningDate, LeavePolicy } =
    req.body;
  try {
    let existing = await Employee.findOne({ empId });
    if (!existing)
      return res.status(400).json({ msg: " this Employee exists" });
    const emp = new Employee({
      empId,
      name,
      email,
      phone,
      department,
      joiningDate,
      LeavePolicy,
    });

    await emp.save();
    res.json(emp);
  } catch (err) {
    console.error(err);

    res.status(500).send("Server error");
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "employee not found" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: err.msg });
  }
};

//update
exports.updateEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(400).json({ messaage: err.message });
  }
};

//delete
exports.deleteEmployeeById = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found " });
    res.json({ message: "employee deleted successfully" });
  } catch (err) {
    res.status(400).json({ massage: err.message });
  }
};
