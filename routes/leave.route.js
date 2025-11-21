const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leave.contrroller");

const {
  applyLeaveSchema,
  approvalLeaveSchema,
  approvelSchema,
} = require("../validations/leave.validation.js");
const { ROLES } = require("../config/constant");
const { schema } = require("../models/leave.model");

//zod validation
const validationZod = (schema) => (req, res, next) => {
  try {
    //parse and replace body (convert dates to Date object as needed )

    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ msg: err.errors ? err.errors : err.message });
  }
};

//Auth middleware - expect function (allowed rolles => middleware )

const auth = require("../middlewares/auth.middleware.js");

router.post(
  "/",
  auth(),
  validationZod(applyLeaveSchema),
  leaveController.applyLeave
);
router.get("/", auth(), leaveController.getLeaves);

//HR?SUPERADMIN approve/reject

router.patch(
  "/:id/decision",
  auth([ROLES.HR, ROLES.SUPERADMIN]),
  validationZod(approvelSchema),
  leaveController.handleApproval
);
