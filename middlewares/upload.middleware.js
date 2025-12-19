import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hr-cms/other-adjustment",
    allowed_formates: ["jpg", "png", "jpeg", "pdf"],
  },
});
export const upload = multer({ storage });
