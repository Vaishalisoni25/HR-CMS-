import { Schema, model } from "mongoose";
import { EMAIL_STATUS } from "../config/constant.js";

const EmployeeFeedbackSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    type: {
      type: String,
      enum: ["feedback", "code-review"],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String, // HTML allowed
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    emailStatus: {
      type: String,
      enum: Object.values(EMAIL_STATUS),
    },

    emailID: {
      type: String, // messageId from email service
    },
  },
  { timestamps: true }
);

export default model("EmployeeFeedback", EmployeeFeedbackSchema);
