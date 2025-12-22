import { Router } from "express";
const router = Router();
import { generateEmployeeSummary } from "../controllers/employeeSummary.controller.js";
import { ROLES } from "../config/constant.js";
import auth from "../middlewares/auth.middleware.js";

router.post(
  "/:id",
  auth([ROLES.HR, ROLES.SUPERADMIN]),
  generateEmployeeSummary
);
router.get("/:id", auth(), generateEmployeeSummary);

export default router;
