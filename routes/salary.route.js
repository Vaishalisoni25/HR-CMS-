import { Router } from "express";
import { generateSalary, getSalary } from "../controllers/salary.controller.js";
import { ROLES } from "../config/constant.js";
import auth from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", auth([ROLES.SUPERADMIN, ROLES.HR]), generateSalary);
router.get("/:id/employee", auth(), getSalary);

// router.put("/update/:id", auth([ROLES.SUPERADMIN, ROLES.HR]), updateSalary);

export default router;
