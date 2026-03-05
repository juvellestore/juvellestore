import express from "express";
import {
  getStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
} from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken, isAdmin);
router.get("/stats", getStats);
router.get("/orders", getAllOrders);
router.put("/orders/:orderId", updateOrderStatus);
router.get("/users", getAllUsers);

export default router;
