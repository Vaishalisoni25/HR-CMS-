import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getSettings,
  UpsertSettingPortal,
} from "../controllers/settings.controller.js";
import { ROLES } from "../config/constant.js";
const router = Router();

router.post("/", auth([ROLES.HR, ROLES.SUPERADMIN]), UpsertSettingPortal);
router.get("/:id", auth([ROLES.HR, ROLES.SUPERADMIN]), getSettings);

export default router;
