const express = require("express");
const {
  createEmployee,
  getEmployee,
} = require("../controllers/emplController");
const auth = require("../middleware/JWT");
const roleCheck = require("../middleware/Roles");

const router = express.Router();

// Fetch employees (only accessible by HR or superadmin)
router.get("/list", (req, res) => {
  res.json({ message: "employee list is working!" }); // Test response
});

// Create employee entry (only accessible by superadmin and HR)
router.post("/", auth, roleCheck("superadmin", "hr"), createEmployee);

module.exports = router;
