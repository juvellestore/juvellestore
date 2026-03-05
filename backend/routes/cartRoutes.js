import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.get("/", getCart);
router.post("/", addToCart);
router.put("/:cartItemId", updateCartItem);
router.delete("/", clearCart);
router.delete("/:cartItemId", removeCartItem);

export default router;
