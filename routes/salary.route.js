import { Router } from "express";
import {
  generateSalary,
  getSalaryById,
  getAllSalary,
} from "../controllers/salary.controller.js";
import { ROLES } from "../config/constant.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:id", auth([ROLES.SUPERADMIN, ROLES.HR]), generateSalary);
router.get("/:id", auth(), getSalaryById);
router.get("/", auth([ROLES.HR, ROLES.SUPERADMIN]), getAllSalary);

// router.put("/update/:id", auth([ROLES.SUPERADMIN, ROLES.HR]), updateSalary);

export default router;
