const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");

router.post("/mark", attendanceController.markAttendance);

router.get("/:employeeId", attendanceController.getAttendance);

module.exports = router;
