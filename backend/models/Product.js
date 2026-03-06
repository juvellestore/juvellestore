import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const productSchema = new mongoose.Schema({
  productId: { type: String, default: () => uuidv4() },
  productName: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  sizes: [
    { type: String, enum: ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"] },
  ],
  images: [{ type: String }],
  category: { type: String, default: "churidar" },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: null }, // null = unlimited
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
