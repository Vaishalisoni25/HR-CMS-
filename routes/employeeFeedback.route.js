import { Router } from "express";
import { FeedbackSchema } from "../validations/employeeFeedback.validation.js";
import validate from "../middlewares/validate.middleware.js";
import auth from "../middlewares/auth.middleware.js";
import { ROLES } from "../config/constant.js";
import {
  createEmployeeFeedback,
  getAllEmployeesFeedback,
} from "../controllers/employeeFeedback.controller.js";

const router = Router();

router.post(
  "/:id",
  auth([ROLES.HR, ROLES.SUPERADMIN]),
  validate(FeedbackSchema),
  createEmployeeFeedback
);
router.get("/", auth([ROLES.HR, ROLES.SUPERADMIN]), getAllEmployeesFeedback);

export default router;
