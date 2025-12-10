import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

import { hash, compare } from "bcrypt";
import { customError } from "../utils/customError.js";

const createToken = (user) => {
  return sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "9d" }
  );
};

export async function register(req, res, next) {
  try {
    console.log("running");

    if (req.user.role !== "hr" && req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return next(new customError(""));
    }

    const hashedPass = await hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPass,
      role,
    });

    res.status(201).json({ token: createToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({ token: createToken(user) });
}

export async function getAllUsers(_req, res) {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (req.user.role === "employee" && req.user.id !== id) {
      return next(new customError(""));
    }

    if (req.user.role === "employee") {
      return next(new customError(""));
    }
    const user = await User.findById(res.params.id);

    if (!user) {
      return next("");
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateUserById(req, res) {
  try {
    const user = await User.findByIdAndUpdate(res.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return next(new customError("user not found", 404));
    }
    res.json({
      success: true,
      message: "user updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteUserById(_req, res, next) {
  try {
    const user = await User.findByIdAndDelete(res.params.id);
    if (!user) {
      return next(new customError("user not found", 404));
    }
    res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
