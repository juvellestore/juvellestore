import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      style={{ position: "relative", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setSizePopover(false);
      }}
    >
      <div
        onClick={handleCardClick}
        style={{
          background: "#413038",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid rgba(207,157,184,0.2)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          transition: "box-shadow 0.2s",
        }}
      >
        {/* Image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "3/4",
            overflow: "hidden",
            background: "#2e1f24",
          }}
        >
          {primaryImage ? (
            <>
              <img
                src={primaryImage}
                alt={product.productName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity 0.4s",
                  opacity: hovered && secondImage ? 0 : 1,
                  position: "absolute",
                  inset: 0,
                }}
              />
              {secondImage && (
                <img
                  src={secondImage}
                  alt={product.productName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 0.4s",
                    opacity: hovered ? 1 : 0,
                    position: "absolute",
                    inset: 0,
                  }}
                />
              )}
            </>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#cf9db8",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                }}
              >
                No image
              </span>
            </div>
          )}

          {/* Featured badge */}
          {product.featured && (
            <div
              style={{
                position: "absolute",
                top: "8px",
                left: "8px",
                background: "rgba(85,56,88,0.85)",
                backdropFilter: "blur(4px)",
                color: "#f3e6ec",
                fontSize: "0.65rem",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "20px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "0.875rem" }}>
          <h3
            style={{
              margin: "0 0 4px",
              color: "#f3e6ec",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              lineHeight: 1.3,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {product.productName}
          </h3>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                color: "#f3e6ec",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span
                style={{
                  color: "#cf9db8",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.75rem",
                  textDecoration: "line-through",
                }}
              >
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.inStock}
              style={{
                width: "100%",
                background: product.inStock ? "rgba(85,56,88,0.9)" : "#413038",
                color: product.inStock ? "#f3e6ec" : "#cf9db8",
                border: "1px solid rgba(207,157,184,0.3)",
                borderRadius: "2px",
                padding: "8px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "0.8rem",
                cursor: product.inStock ? "pointer" : "not-allowed",
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
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
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    background: "#2e1f24",
                    border: "1px solid #553858",
                    borderRadius: "8px",
                    padding: "8px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    zIndex: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  <span
                    style={{
                      width: "100%",
                      color: "#cf9db8",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.7rem",
                      marginBottom: "2px",
                    }}
                  >
                    Select size:
                  </span>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSelectSize(size)}
                      style={{
                        background: "#413038",
                        color: "#f3e6ec",
                        border: "1px solid rgba(207,157,184,0.3)",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        fontSize: "0.75rem",
                        fontFamily: "Inter, sans-serif",
                        cursor: "pointer",
                      }}
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
