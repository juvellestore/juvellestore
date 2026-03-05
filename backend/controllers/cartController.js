import CartItem from "../models/CartItem.js";

// GET /api/cart
export const getCart = async (req, res) => {
  const items = await CartItem.find({ userId: req.user._id }).populate(
    "productId",
  );
  res.json({ success: true, items });
};

// POST /api/cart
export const addToCart = async (req, res) => {
  const { productId, size, quantity } = req.body;
  if (!productId || !size)
    return res
      .status(400)
      .json({ success: false, message: "productId and size are required" });

  // If same product+size exists, increment quantity
  let item = await CartItem.findOne({ userId: req.user._id, productId, size });
  if (item) {
    item.quantity += quantity || 1;
    await item.save();
  } else {
    item = await CartItem.create({
      userId: req.user._id,
      productId,
      size,
      quantity: quantity || 1,
    });
  }
  const populated = await item.populate("productId");
  res.status(201).json({ success: true, item: populated });
};

// PUT /api/cart/:cartItemId
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (!quantity || quantity < 1)
    return res
      .status(400)
      .json({ success: false, message: "Quantity must be at least 1" });

  const item = await CartItem.findOneAndUpdate(
    { cartItemId: req.params.cartItemId, userId: req.user._id },
    { quantity },
    { new: true },
  ).populate("productId");
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Cart item not found" });
  res.json({ success: true, item });
};

// DELETE /api/cart/:cartItemId
export const removeCartItem = async (req, res) => {
  const item = await CartItem.findOneAndDelete({
    cartItemId: req.params.cartItemId,
    userId: req.user._id,
  });
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Cart item not found" });
  res.json({ success: true, message: "Item removed" });
};

// DELETE /api/cart (clear all)
export const clearCart = async (req, res) => {
  await CartItem.deleteMany({ userId: req.user._id });
  res.json({ success: true, message: "Cart cleared" });
};
