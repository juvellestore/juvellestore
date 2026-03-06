import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: { type: String },
  size: { type: String },
  quantity: { type: Number },
  priceAtOrder: { type: Number },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => uuidv4() },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  items: [orderItemSchema],
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["cod", "razorpay"],
    default: "cod",
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  orderStatus: {
    type: String,
    enum: ["active", "processing", "shipped", "fulfilled", "cancelled"],
    default: "active",
  },
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
