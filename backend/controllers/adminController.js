import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// GET /api/admin/stats
export const getStats = async (req, res) => {
  const [totalProducts, totalUsers, allOrders] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.find(),
  ]);
  const activeOrders = allOrders.filter(
    (o) => o.orderStatus === "active",
  ).length;
  const totalRevenue = allOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.amount, 0);

  res.json({
    success: true,
    stats: { totalProducts, activeOrders, totalUsers, totalRevenue },
  });
};

// GET /api/admin/orders
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "fullName email")
    .sort({ orderDate: -1 });
  res.json({ success: true, orders });
};

// PUT /api/admin/orders/:orderId
export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const validStatuses = [
    "active",
    "processing",
    "shipped",
    "fulfilled",
    "cancelled",
  ];
  if (!validStatuses.includes(orderStatus))
    return res
      .status(400)
      .json({ success: false, message: "Invalid orderStatus" });

  const order = await Order.findOneAndUpdate(
    { orderId: req.params.orderId },
    { orderStatus },
    { new: true },
  );
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, order });
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  const users = await User.find()
    .select("-password")
    .sort({ dateOfRegistration: -1 });
  res.json({ success: true, users });
};
