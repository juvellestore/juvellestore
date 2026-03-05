import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
  userId: { type: String, default: () => uuidv4() },
  fullName: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  phoneNumber: { type: String, trim: true },
  address: { type: String, trim: true },
  dateOfRegistration: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
