const express = require("express");

const router = express.Router();
const authController = require("../controllers/controller");

router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").islength({ min: 5 }),
    body("role").optional().isIn(["super_admin", "hr"]),
  ],
  authController.register
);

router.post(
  "login",
  [body("email").isEmail(), body("password").exists()],
  authController.login
);

module.exports = router;
