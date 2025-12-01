import { Router } from "express";
import {
  createEmployee,
  deleteEmployeeById,
  getEmployeeById,
  getEmployees,
  updateEmployeeById,
} from "../controllers/employee.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { employeeSchema } from "../validations/employee.validation.js";
import { ROLES } from "../config/constant.js";
import { updateUserById } from "../controllers/user.controller.js";

const router = Router();

router.post(
  "/",
  auth([ROLES.SUPERADMIN, ROLES.HR]),
  validate(employeeSchema),
  createEmployee
);
router.get("/", auth([ROLES.SUPERADMIN, ROLES.HR]), getEmployees);

router.get("/:id", auth(), getEmployeeById);

router.put(":/id", auth([ROLES.HR, ROLES.SUPERADMIN]), updateEmployeeById);

router.delete("/id", auth([ROLES.HR, ROLES.SUPERADMIN]), deleteEmployeeById);

export default router;
