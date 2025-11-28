import express from "express";
import { getLeaveBalance } from "../controllers/leave.contrroller";
import auth from "../middlewares/auth.middleware.js";
import { ROLES } from "../config/constant.js";
const router = express.Router();

router.get("/balance/", getLeaveBalance);

export default router;
