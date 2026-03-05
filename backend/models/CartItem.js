import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const cartItemSchema = new mongoose.Schema({
  cartItemId: { type: String, default: () => uuidv4() },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: { type: String, required: true },
  quantity: { type: Number, default: 1, min: 1 },
  addedAt: { type: Date, default: Date.now },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
