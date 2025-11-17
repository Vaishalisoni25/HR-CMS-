const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/AttendController");

router.post("/mark", attendanceController.markAttendance);

router.get("/:employeeId", attendanceController.getAttendance);

module.exports = router;
