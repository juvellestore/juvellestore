import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrder,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/:orderId", getOrder);

export default router;
