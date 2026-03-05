import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/register
export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  if (password.length < 8)
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must be at least 8 characters",
      });

  const existing = await User.findOne({ email });
  if (existing)
    return res
      .status(400)
      .json({ success: false, message: "Email already registered" });

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName: fullName?.trim(),
    email,
    password: hashed,
  });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });

  const token = generateToken(user._id);
  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      address: user.address,
    },
  });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ success: true, user });
};

// PUT /api/auth/me
export const updateMe = async (req, res) => {
  const { fullName, phoneNumber, address } = req.body;
  const updated = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName: fullName?.trim(),
      phoneNumber: phoneNumber?.trim(),
      address: address?.trim(),
    },
    { new: true, runValidators: true },
  ).select("-password");
  res.json({ success: true, user: updated });
};
