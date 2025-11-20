const express = require("express");
const {
  markAttendance,
  getAttendance,
} = require("../controllers/attendance.controller");
const auth = require("../middleware/auth.middleware");
const { ROLES } = require("../config/constant");

const router = express.Router();

router.post("/", auth([ROLES.SUPERADMIN, ROLES.HR]), markAttendance);
router.get("/", auth([ROLES.SUPERADMIN, ROLES.HR]), getAttendance);

module.exports = router;
