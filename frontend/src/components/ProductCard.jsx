import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiChevronDown } from "react-icons/fi";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imgUrl = (img) =>
  img?.startsWith("http") ? img : `${VITE_API_URL}${img}`;

const ProductCard = ({ product, onOpenAuth }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [sizePopover, setSizePopover] = useState(false);
  const [adding, setAdding] = useState(false);

  const primaryImage = product.images?.[0] ? imgUrl(product.images[0]) : null;
  const secondImage = product.images?.[1] ? imgUrl(product.images[1]) : null;

  const handleCardClick = () => navigate(`/product/${product._id}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      onOpenAuth?.();
      return;
    }
    if (!product.sizes || product.sizes.length === 0) {
      handleSelectSize("Free Size");
      return;
    }
    setSizePopover((p) => !p);
  };

  const handleSelectSize = async (size) => {
    setSizePopover(false);
    setAdding(true);
    try {
      await addToCart(product._id, size, 1);
      toast.success(`Added to cart - ${size}`);
    } catch {
      toast.error("Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSizePopover(false);
      }}
    >
      <div
        onClick={handleCardClick}
        className="bg-cocoa-orchid rounded-lg overflow-hidden border border-velvet-rose-mist/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-shadow duration-200"
      >
        {/* Image */}
        <div className="relative aspect-3/4 overflow-hidden bg-midnight-truffle">
          {primaryImage ? (
            <>
              <img
                src={primaryImage}
                alt={product.productName}
                className={`w-full h-full object-cover transition-opacity duration-400 absolute inset-0 ${
                  hovered && secondImage ? "opacity-0" : "opacity-100"
                }`}
              />
              {secondImage && (
                <img
                  src={secondImage}
                  alt={product.productName}
                  className={`w-full h-full object-cover transition-opacity duration-400 absolute inset-0 ${
                    hovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-velvet-rose-mist font-poppins text-xs">
                No image
              </span>
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-royal-plum-veil/85 backdrop-blur-xs text-ivory-blush text-[0.65rem] font-inter font-semibold px-2 py-0.5 rounded-[20px] tracking-[0.05em] uppercase">
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="m-0 mb-1 text-ivory-blush font-montserrat font-semibold text-[0.875rem] leading-tight overflow-hidden line-clamp-2">
            {product.productName}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-ivory-blush font-montserrat font-bold text-base">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-velvet-rose-mist font-poppins text-xs line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {product.inStock &&
            product.stockQuantity !== undefined &&
            product.stockQuantity !== null && (
              <div className="mb-3">
                <span
                  className={`text-[0.75rem] font-inter font-medium px-2 py-0.5 rounded-sm ${
                    product.stockQuantity <= 5
                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                      : "bg-green-500/10 text-green-400 border border-green-500/20"
                  }`}
                >
                  {product.stockQuantity} in stock
                </span>
              </div>
            )}

          {/* Add to cart button */}
          <div className="relative">
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.inStock}
              className={`w-full border border-velvet-rose-mist/30 rounded-sm p-2 font-inter font-medium text-[0.8rem] transition-colors duration-200 flex items-center justify-center gap-1.5 ${
                product.inStock
                  ? "bg-royal-plum-veil/90 text-ivory-blush cursor-pointer hover:bg-royal-plum-veil"
                  : "bg-cocoa-orchid text-velvet-rose-mist cursor-not-allowed"
              }`}
            >
              {!product.inStock ? (
                "Out of Stock"
              ) : adding ? (
                "Adding…"
              ) : (
                <>
                  <FiShoppingCart size={14} /> Add to Cart
                  {product.sizes?.length > 0 && <FiChevronDown size={12} />}
                </>
              )}
            </button>

            {/* Size popover */}
            <AnimatePresence>
              {sizePopover && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-[calc(100%+6px)] left-0 right-0 bg-midnight-truffle border border-royal-plum-veil rounded-lg p-2 flex flex-wrap gap-1.5 z-10 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                >
                  <span className="w-full text-velvet-rose-mist font-inter text-[0.7rem] mb-0.5">
                    Select size:
                  </span>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      className="bg-cocoa-orchid text-ivory-blush border border-velvet-rose-mist/30 rounded px-2.5 py-1 text-xs font-inter cursor-pointer hover:bg-cocoa-orchid/80 transition-colors duration-200"
                    >
                      {size}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
