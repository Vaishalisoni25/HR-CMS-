import express from "express";
import { Router } from "express";
import validate from "../middlewares/validate.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import { ROLES } from "../config/constant.js";
import {
  createSalaryStructure,
  deleteSalaryStructureById,
  getSalaryStructure,
  getSalaryStructureById,
  updateSalaryStructureById,
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

router.patch(
  "/:id",
  auth([ROLES.HR, ROLES.SUPERADMIN]),
  updateSalaryStructureById
);

router.delete(
  "/:id",
  auth([ROLES.HR, ROLES.SUPERADMIN], deleteSalaryStructureById)
);

export default router;
