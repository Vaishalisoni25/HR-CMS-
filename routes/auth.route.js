import express from "express";
import {
  register,
  login,
  getAllUsers,
} from "../controllers/user.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { ROLES } from "../config/constant.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/", ([ROLES.HR, ROLES.SUPERADMIN], getAllUsers));
export default router;
