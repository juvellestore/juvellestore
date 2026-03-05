import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const fileFilter = (req, file, cb) => {
  const allowed = [".webp", ".jpg", ".jpeg", ".png"];
  if (allowed.includes(path.extname(file.originalname).toLowerCase()))
    cb(null, true);
  else cb(new Error("Only image files allowed"));
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
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
