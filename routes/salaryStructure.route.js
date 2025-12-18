import express from "express";
import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import { ROLES } from "../config/constant.js";
import {
  createSalaryStructure,
  getSalaryStructure,
  getSalaryStructureById,
} from "../controllers/salaryStructure.controller.js";
import { SalaryStructureSchema } from "../validations/salaryStructure.validations.js";
const router = Router();

router.post(
  "/:id",
  auth([ROLES.SUPERADMIN, ROLES.HR]),
  validate(SalaryStructureSchema),
  createSalaryStructure
);
router.get("/:id", auth(), getSalaryStructureById);

router.get("/", auth([ROLES.SUPERADMIN, ROLES.HR]), getSalaryStructure);

export default router;
