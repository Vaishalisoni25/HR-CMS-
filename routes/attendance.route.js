import { Router } from "express";
import {
  markAttendance,
  getAttendance,
} from "../controllers/attendance.controller.js";
import auth from "../middlewares/auth.middleware.js";
import { ROLES } from "../config/constant.js";

const router = Router();

router.post("/", auth([ROLES.SUPERADMIN, ROLES.HR]), markAttendance);
router.get("/", auth(), getAttendance);

export default router;
