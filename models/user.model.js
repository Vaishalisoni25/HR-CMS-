const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
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
    enum: ["superadmin", "hr"],
    default: "hr",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
