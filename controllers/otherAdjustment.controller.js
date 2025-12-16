import Other_Adjustment from "../models/otherAdjustment.model.js";
import Employee from "../models/employee.model.js";
import { validationMonthYear } from "../utils/date.js";
import { success } from "zod";

export async function createAdjustment(req, res, next) {
  try {
    const { employeeId, month, year, amount, type, description, image } =
      req.body;

    if (!employeeId) {
      return res.status(404).json({ message: "Employee Id is required" });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required" });
    }
    const result = validationMonthYear(month, year);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    const otherAdjustment = await Other_Adjustment.create({
      employeeId,
      month,
      year,
      amount,
      type,
      description,
      image,
    });
    res.status(201).json({
      success: true,
      message: "Other Adjustment Created Successfully.",
      data: otherAdjustment,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllAjustment(_req, res, next) {
  try {
    const adjustments = await Other_Adjustment.find().lean();
    if (!adjustments) {
      return res.status(404).json({ message: "Adjustment not found" });
    }
    res.status(200).json({
      success: true,
      message: "Ajustment fetched successfully",
      data: adjustments,
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdjustmentById(req, res, next) {
  try {
    const employeeId = req.params.id;
    if (!employeeId) {
      return res.status(404).json({ message: "Employee Id required" });
    }

    const adjustments = await Other_Adjustment.find({ employeeId });
    console.log(adjustments);
    if (!adjustments) {
      return res.status(404).json({ message: "Other Adjustment not found" });
    }
    res.status(200).json({
      success: true,
      message: "Other Adjustment fetched successfully",
      data: adjustments,
    });
  } catch (err) {
    next(err);
  }
}
export async function updateAdjustmentById(req, res, next) {
  try {
    const adjustmentId = req.params.id;
    if (!adjustmentId) {
      return res.status(400).json({ message: "Adjustment Id is required" });
    }
    const adjustments = await Other_Adjustment.findByIdAndUpdate(
      adjustmentId,
      req.body,
      {
        new: true,
      }
    );
    if (!adjustments) {
      return res.status(404).json({ message: "Adjustment not found" });
    }
    res.status(200).json({
      success: true,
      message: "Adjustments Updated Successfully",
      data: adjustments,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAdjustmentById(req, res, next) {
  try {
    const adjustmentId = req.params.id;
    if (!adjustmentId) {
      return res.status(400).json({ message: "Adjustment Id is required" });
    }
    const adjustments = await Other_Adjustment.findByIdAndDelete(
      adjustmentId,
      req.body,
      {
        new: true,
      }
    );
    if (!adjustments) {
      return res.status(404).json({ message: "Adjustment not found" });
    }
    res.status(200).json({
      success: true,
      message: "Adjestments deleted successfully",
      data: adjustments,
    });
  } catch (err) {
    next(err);
  }
}
