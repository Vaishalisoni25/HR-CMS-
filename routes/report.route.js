import express from "express";
import { employeeReport } from "../controllers/report.controller.js";

const router = express.Router();

router.get("/employees", employeeReport);

export default router;
