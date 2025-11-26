import { Schema, model } from "mongoose";
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    LowerCase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    select: false,
  },

  role: {
    type: String,
    enum: ["superadmin", "hr", "employee"],
    default: "hr",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("User", UserSchema);
