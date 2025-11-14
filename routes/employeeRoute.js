const express = require("express");
const { createEmployee, getEmployee } = require("./controllers/emplController");
const auth = require("./middleware/JWT");
const roleCheck = require("./middleware/Roles");

const router = express.Router();

router.post("/", auth, roleCheck("superadmin", "hr"), getEmployee);

module.exports = router;
