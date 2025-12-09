import Settings from "../models/settings.model.js";
import { ROLES } from "../config/constant.js";
import { portalSettingsSchema } from "../validations/settings.validation.js";
import settingsModel from "../models/settings.model.js";
import { success } from "zod";

export async function createSettingPortal(req, res) {
  try {
    const parsed = portalSettingsSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ errors: parsed.error.errors });
    const payload = parsed.data;

    const fixedId = process.env.SETTINGS_ID;
    const settings = await Settings.findOneAndUpdate(
      { _id: fixedId },
      { $set: payload },
      { new: true, upsert: true }
    );

    return res.json({
      success: true,
      message: "Setting Saved",
      data: settings,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}

export async function getSettingPortal(req, res) {
  try {
    const fixId = process.env.SETTINGS_ID;
    let settings = await Settings.findById(fixId);
    res.json({
      success: true,
      message: "fetched settings successfully",
      data: settings,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
}
