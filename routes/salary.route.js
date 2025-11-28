import { Router } from "express";
import {
  generateSalary,
  getSalary,
  updateSalary,
} from "../controllers/salary.controller.js";
import { ROLES } from "../config/constant.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/generateSalary",
  auth([ROLES.SUPERADMIN, ROLES.HR]),
  generateSalary
);
router.get("/getSalary/:id/employee", auth(), getSalary);

router.put(
  "/salary/update/:id",
  auth([ROLES.SUPERADMIN, ROLES.HR]),
  updateSalary
);

export default router;
