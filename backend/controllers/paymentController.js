import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";

// POST /api/payment/create-order
// Only creates a Razorpay order — does NOT write to our DB yet.
// The Order is created in DB only after payment is verified.
export const createRazorpayOrder = async (req, res) => {
  const { fullName, phoneNumber, address } = req.body;
  if (!fullName || !phoneNumber || !address) {
    return res.status(400).json({
      success: false,
      message: "fullName, phoneNumber, and address are required",
    });
  }

  const cartItems = await CartItem.find({ userId: req.user._id }).populate(
    "productId",
  );
  if (!cartItems.length) {
    return res.status(400).json({ success: false, message: "Cart is empty" });
  }

  const items = cartItems.map((ci) => ({
    productId: ci.productId._id,
    productName: ci.productId.productName,
    size: ci.size,
    quantity: ci.quantity,
    priceAtOrder: ci.productId.price,
  }));

  const amount = items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);

  // Razorpay receipt IDs must be ≤ 40 characters
  const userId = req.user._id.toString().slice(-8);
  const ts = Date.now().toString().slice(-8);
  const receipt = `jvl_${userId}_${ts}`; // max ~21 chars

  // Create Razorpay Order only (no DB write here)
  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt,
  };

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      // Pass back shipping info so the frontend can include it in verify call
      shippingDetails: { fullName, phoneNumber, address },
    });
  } catch (error) {
    console.error(
      "Razorpay order error:",
      error?.error || error?.message || error,
    );
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create Razorpay order",
        detail: error?.error?.description || undefined,
      });
  }
};

// POST /api/payment/verify
// Verifies Razorpay signature, then creates the Order in DB and clears cart.
export const verifyPayment = async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    fullName,
    phoneNumber,
    address,
  } = req.body;

  if (
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !razorpaySignature ||
    !fullName ||
    !phoneNumber ||
    !address
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required payment fields" });
  }

  try {
    // Verify signature using HMAC-SHA256
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (isAuthentic) {
      // Re-fetch cart items (still present — only cleared after verify)
      const cartItems = await CartItem.find({ userId: req.user._id }).populate(
        "productId",
      );

      if (!cartItems.length) {
        return res.status(400).json({
          success: false,
          message: "Cart is empty or already processed",
        });
      }

      const items = cartItems.map((ci) => ({
        productId: ci.productId._id,
        productName: ci.productId.productName,
        size: ci.size,
        quantity: ci.quantity,
        priceAtOrder: ci.productId.price,
      }));

      const amount = items.reduce(
        (sum, i) => sum + i.priceAtOrder * i.quantity,
        0,
      );

      // Create the order in DB now that payment is confirmed
      const order = await Order.create({
        userId: req.user._id,
        fullName: fullName.trim(),
        email: req.user.email,
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        items,
        amount,
        paymentMethod: "razorpay",
        paymentStatus: "paid",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      // Clear the user's cart
      await CartItem.deleteMany({ userId: req.user._id });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        order,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to verify payment" });
  }
};
