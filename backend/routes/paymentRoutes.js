import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", verifyToken, createRazorpayOrder);
router.post("/verify", verifyToken, verifyPayment);

export default router;
