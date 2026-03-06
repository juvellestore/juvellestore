import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Upload a single file buffer to Cloudinary, returns the secure URL
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const stream = cloudinary.uploader.upload_stream(
      { folder: "juvelle" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });

// GET /api/products
export const getProducts = async (req, res) => {
  const { sort } = req.query;
  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  else if (sort === "price_desc") sortOption = { price: -1 };
  else if (sort === "featured") sortOption = { featured: -1, createdAt: -1 };

  const products = await Product.find().sort(sortOption);
  res.json({ success: true, products });
};

// GET /api/products/:id
export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  res.json({ success: true, product });
};

// POST /api/products (admin)
export const createProduct = async (req, res) => {
  const {
    productName,
    description,
    price,
    originalPrice,
    sizes,
    category,
    inStock,
    featured,
  } = req.body;

  if (!productName || !price)
    return res
      .status(400)
      .json({ success: false, message: "productName and price are required" });

  // Upload all images to Cloudinary
  const images = req.files?.length
    ? await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)))
    : [];

  const parsedSizes =
    typeof sizes === "string" ? JSON.parse(sizes) : sizes || [];

  const product = await Product.create({
    productName: productName.trim(),
    description: description?.trim(),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    sizes: parsedSizes,
    images,
    category: category || "churidar",
    inStock:
      inStock !== undefined ? inStock === "true" || inStock === true : true,
    featured: featured === "true" || featured === true,
  });

  res.status(201).json({ success: true, product });
};

// PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  const {
    productName,
    description,
    price,
    originalPrice,
    sizes,
    category,
    inStock,
    featured,
  } = req.body;

  const update = {};
  if (productName) update.productName = productName.trim();
  if (description !== undefined) update.description = description.trim();
  if (price) update.price = Number(price);
  if (originalPrice !== undefined)
    update.originalPrice = Number(originalPrice) || undefined;
  if (sizes)
    update.sizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
  if (category) update.category = category;
  if (inStock !== undefined)
    update.inStock = inStock === "true" || inStock === true;
  if (featured !== undefined)
    update.featured = featured === "true" || featured === true;

  // Upload new images to Cloudinary if provided
  if (req.files?.length) {
    update.images = await Promise.all(
      req.files.map((f) => uploadToCloudinary(f.buffer)),
    );
  }

  const product = await Product.findByIdAndUpdate(req.params.id, update, {
    new: true,
  });
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });

  res.json({ success: true, product });
};

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  res.json({ success: true, message: "Product deleted" });
};
