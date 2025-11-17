const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/controller");

const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("role").optional().isIn(["super_admin", "hr"]),
  ],
  authController.register
);

// Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  authController.login
);

module.exports = router;
