import { Router } from "express";
import {
  createEmployee,
  getEmployees,
} from "../controllers/employee.controller.js";
import auth from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { employeeSchema } from "../validations/employee.validation.js";
import { ROLES } from "../config/constant.js";

const router = Router();

router.post(
  "/",
  auth([ROLES.SUPERADMIN, ROLES.HR]),
  validate(employeeSchema),
  createEmployee
);
router.get("/", auth([ROLES.SUPERADMIN, ROLES.HR]), getEmployees);

export default router;
