import { Schema, model } from "mongoose";
const leaveBalanceSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },

    sick: {
      type: Number,
      default: 1,
    },

    privilege: {
      type: Number,
      default: 5,
    },
    LWP: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

export default model("Leave", leaveBalanceSchema);
