import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getSettingPortal,
  createSettingPortal,
} from "../controllers/settings.controller.js";
import { ROLES } from "../config/constant.js";
const router = Router();

router.post("/", auth([ROLES.HR, ROLES.SUPERADMIN]), createSettingPortal);
router.get("/", auth([ROLES.HR, ROLES.SUPERADMIN]), getSettingPortal);

export default router;
