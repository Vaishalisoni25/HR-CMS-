const express = require("express");
const {
  createEmployee,
  getEmployees,
} = require("../controllers/employee.controller");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { employeeSchema } = require("../validations/employee.validation");
const { ROLES } = require("../config/constant");

const router = express.Router();

router.post(
  "/",
  auth([ROLES.SUPERADMIN, ROLES.HR]),
  validate(employeeSchema),
  createEmployee
);
router.get("/", auth([ROLES.SUPERADMIN, ROLES.HR]), getEmployees);

module.exports = router;
