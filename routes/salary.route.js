import { Router } from "express";
import { generateSalary, getSalary } from "../controllers/salary.controller.js";

import auth from "../middlewares/auth.middleware.js"; // <-- REQUIRED

import { ROLES } from "../config/constant.js";

const router = Router();

// create salary (HR / SUPERADMIN)
router.post("/", auth([ROLES.HR, ROLES.SUPERADMIN]), generateSalary);

// get salary of one employee
router.get("/:id", auth(), getSalary);

export default router;
