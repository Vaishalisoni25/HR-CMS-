const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User exists" });

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPass,
    role,
  });

  res.status(201).json({ token: createToken(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ token: createToken(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByIdAndUpdate;
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ massage: "Server error", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(res.param.id).select("-password");

    if (!user) {
      return res.status(404).json({ massage: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ massage: msg.err });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(res.param.id, req.body, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ massage: "user not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ massage: massage.err });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(res.param.id);
    if (!user) {
      return res.status(404).json({ massage: " user not  found" });
    }
    res.json({ massage: "User Deleted Successefully", user });
  } catch (err) {
    res.satatus(400).json({ massage: massage.err });
  }
};
