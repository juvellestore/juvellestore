import Order from "../models/Order.js";
import CartItem from "../models/CartItem.js";

// POST /api/orders — place order from current cart
export const placeOrder = async (req, res) => {
  const { fullName, phoneNumber, address, paymentStatus } = req.body;
  if (!fullName || !phoneNumber || !address)
    return res.status(400).json({
      success: false,
      message: "fullName, phoneNumber, and address are required",
    });

  const cartItems = await CartItem.find({ userId: req.user._id }).populate(
    "productId",
  );
  if (!cartItems.length)
    return res.status(400).json({ success: false, message: "Cart is empty" });

  const items = cartItems.map((ci) => ({
    productId: ci.productId._id,
    productName: ci.productId.productName,
    size: ci.size,
    quantity: ci.quantity,
    priceAtOrder: ci.productId.price,
  }));

  const amount = items.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);

  const order = await Order.create({
    userId: req.user._id,
    fullName: fullName.trim(),
    email: req.user.email,
    phoneNumber: phoneNumber.trim(),
    address: address.trim(),
    items,
    amount,
    paymentMethod: "cod",
    paymentStatus: paymentStatus || "pending",
  });

  // Clear cart
  await CartItem.deleteMany({ userId: req.user._id });

  res.status(201).json({ success: true, order });
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({
    orderDate: -1,
  });
  res.json({ success: true, orders });
};

// GET /api/orders/:orderId
export const getOrder = async (req, res) => {
  const order = await Order.findOne({
    orderId: req.params.orderId,
    userId: req.user._id,
  });
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order });
};
