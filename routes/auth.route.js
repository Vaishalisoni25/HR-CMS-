const express = require("express");
const { register, login } = require("../controllers/user.controller");
const validate = require("../middleware/validate.middleware");
const routes = require("./auth.route");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
