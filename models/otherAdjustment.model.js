import mongoose from "mongoose";
import { number } from "zod";
const { Schema, model } = mongoose;

const adjustmentSchema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  type: {
    type: String,
    enum: ["ADD", "LESS"],
    required: true,
  },

  amount: {
    type: number,
    default: 0,
  },

  description: { type: String },

  image: { type: String }, // URL or file path

  createdAt: { type: Date, default: Date.now },
});

export default model("otherAdjustment", adjustmentSchema);
