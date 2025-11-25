import { Router } from "express";
const router = Router();
import {
  applyLeave,
  getLeaves,
  handleApproval,
} from "../controllers/leave.contrroller.js";

import {
  applyLeaveSchema,
  approvelSchema,
} from "../validations/leave.validation.js";
import { ROLES } from "../config/constant.js";

//zod validation
const validationZod = (schema) => (req, res, next) => {
  try {
    //parse and replace body (convert dates to Date object as needed )

    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ msg: "validation error", errors: err.errors });
  }
};

//Auth middleware - expect function (allowed rolles => middleware )

import auth from "../middlewares/auth.middleware.js";

router.post("/", auth(), validationZod(applyLeaveSchema), applyLeave);
router.get("/", auth(), getLeaves);

//HR?SUPERADMIN approve/reject

router.patch(
  "/:id/decision",
  auth([ROLES.HR, ROLES.SUPERADMIN]),
  validationZod(approvelSchema),
  handleApproval
);
export default router;
