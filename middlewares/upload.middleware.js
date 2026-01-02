import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hr-cms/other-adjustment",
    allowed_formats: ["jpg", "png", "jpeg", "pdf"],
  },
});
export const upload = multer({ storage });
