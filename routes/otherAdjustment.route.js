import { Router } from "express";
import auth from "../middlewares/auth.middleware.js";
import { ROLES } from "../config/constant.js";
import validate from "../middlewares/validate.middleware.js";
import { AdjustmentSchema } from "../validations/otherAdjustment.validation.js";
import {
  createAdjustment,
  deleteAdjustmentById,
  getAdjustmentById,
  getAllAdjustment,
  updateAdjustmentById,
} from "../controllers/otherAdjustment.controller.js";
validate;
import { upload } from "../middlewares/upload.middleware.js";
const router = Router();

router.post(
  "/:id",
  auth([ROLES.HR, ROLES.SUPERADMIN]),
  upload.single("image"),
  validate(AdjustmentSchema),
  createAdjustment
);
router.get("/", auth([ROLES.HR, ROLES.SUPERADMIN]), getAllAdjustment);
router.get("/:id", auth([ROLES.HR, ROLES.SUPERADMIN]), getAdjustmentById);
router.patch("/:id", auth([ROLES.HR, ROLES.SUPERADMIN]), updateAdjustmentById);
router.delete("/:id", auth([ROLES.HR, ROLES.SUPERADMIN]), deleteAdjustmentById);

export default router;
