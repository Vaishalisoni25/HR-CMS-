import Settings from "../models/settings.model.js";
import { ROLES } from "../config/constant.js";
import { portalSettingsSchema } from "../validations/settings.validation.js";
import settingsModel from "../models/settings.model.js";

export async function createSettingPortal(req, res, next) {
  try {
    const parsed = portalSettingsSchema.safeParse(req.body);
    console.log(req.body);

    if (!parsed.success) {
      console.log(parsed.error.errors);
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.format(),
      });
    }

    const settings = await Settings.findOneAndUpdate(
      { _id: process.env.SETTINGS_ID },
      { $set: parsed.data },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Setting Saved",
      data: settings,
    });
  } catch (err) {
    next(err);
  }
}

export async function getSettingPortal(_req, res, next) {
  try {
    let settings = await Settings.findById(process.env.SETTINGS_ID);
    res.json({
      success: true,
      message: "fetched settings successfully",
      data: settings,
    });
  } catch (err) {
    next(err);
  }
}
