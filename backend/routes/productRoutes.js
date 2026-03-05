import express from "express";
import multer from "multer";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// multer 2.x: use memoryStorage — files go to Cloudinary, not disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  createProduct,
);
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.array("images", 5),
  updateProduct,
);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
