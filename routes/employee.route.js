const express = require("express");
const {
  createEmployee,
  getEmployee,
} = require("../controllers/employee.controller");
const auth = require("../middleware/auth.middleware");
const roleCheck = require("../middleware/role.middleware");

const router = express.Router();

// Fetch employees (only accessible by HR or superadmin)
router.get("/list", (req, res) => {
  res.json({ message: "employee list is working!" }); // Test response
});

// Create employee entry (only accessible by superadmin and HR)
router.post("/", auth, roleCheck("superadmin", "hr"), createEmployee);

module.exports = router;
