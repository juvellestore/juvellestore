import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiShoppingCart, FiArrowLeft, FiZap } from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/axios.js";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imgUrl = (img) =>
  img?.startsWith("http") ? img : `${VITE_API_URL}${img}`;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data.product);
        if (res.data.product.sizes?.length > 0)
          setSelectedSize(res.data.product.sizes[0]);
      } catch {
        toast.error("Product not found");
        navigate("/store");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleAddToCart = async (buyNow = false) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, selectedSize || "Free Size", quantity);
      toast.success("Added to cart!");
      if (buyNow) navigate("/checkout");
    } catch {
      toast.error("Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
          }}
        >
          <span style={{ color: "#cf9db8", fontFamily: "Poppins, sans-serif" }}>
            Loading…
          </span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length > 0 ? product.images.map((img) => imgUrl(img)) : [];

  return (
    <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
      <Navbar />
      <div className="max-w-[1100px] mx-auto px-4 py-8 sm:px-6 w-full">
        {/* Breadcrumb */}
        <Link
          to="/store"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#cf9db8",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.85rem",
            textDecoration: "none",
            marginBottom: "2rem",
          }}
        >
          <FiArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-start w-full">
          {/* Image gallery */}
          <div>
            <motion.div
              key={mainImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "#413038",
                borderRadius: "8px",
                overflow: "hidden",
                aspectRatio: "3/4",
                marginBottom: "0.75rem",
              }}
            >
              {images.length > 0 ? (
                <img
                  src={images[mainImg]}
                  alt={product.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
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
                    }}
                  >
                    No image
                  </span>
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    style={{
                      width: "72px",
                      height: "96px",
                      borderRadius: "4px",
                      overflow: "hidden",
                      border:
                        i === mainImg
                          ? "2px solid #553858"
                          : "2px solid transparent",
                      padding: 0,
                      background: "#413038",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.featured && (
              <span
                style={{
                  display: "inline-block",
                  background: "#553858",
                  color: "#f3e6ec",
                  fontSize: "0.65rem",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  marginBottom: "12px",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                Featured
              </span>
            )}
            <h1
              style={{
                color: "#f3e6ec",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                margin: "0 0 12px",
                lineHeight: 1.2,
              }}
            >
              {product.productName}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  color: "#f3e6ec",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span
                    style={{
                      color: "#cf9db8",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "1rem",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
            </div>

            {product.description && (
              <p
                style={{
                  color: "#cf9db8",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  marginBottom: "16px",
                }}
              >
                {product.description}
              </p>
            )}

            {/* Sizing Chart */}
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  color: "#f3e6ec",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "10px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Sizing Chart
              </p>
              <div
                style={{
                  background: "#413038",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: "1px solid rgba(207,157,184,0.15)",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#553858",
                      }}
                    >
                      <th
                        style={{
                          color: "#f3e6ec",
                          fontWeight: 600,
                          padding: "8px 14px",
                          textAlign: "left",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Size
                      </th>
                      <th
                        style={{
                          color: "#f3e6ec",
                          fontWeight: 600,
                          padding: "8px 14px",
                          textAlign: "left",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Inches
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: "S", inches: 36 },
                      { size: "M", inches: 38 },
                      { size: "L", inches: 40 },
                      { size: "XL", inches: 42 },
                      { size: "XXL", inches: 44 },
                      { size: "3XL", inches: 46 },
                      { size: "4XL", inches: 48 },
                      { size: "5XL", inches: 50 },
                    ].map(({ size, inches }, i) => (
                      <tr
                        key={size}
                        style={{
                          background:
                            i % 2 === 0
                              ? "transparent"
                              : "rgba(255,255,255,0.03)",
                          borderTop: "1px solid rgba(207,157,184,0.08)",
                        }}
                      >
                        <td
                          style={{
                            color: "#f3e6ec",
                            padding: "7px 14px",
                            fontWeight: 600,
                          }}
                        >
                          {size}
                        </td>
                        <td
                          style={{
                            color: "#cf9db8",
                            padding: "7px 14px",
                          }}
                        >
                          {inches}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    color: "#f3e6ec",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginBottom: "8px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  Size
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "1px solid",
                        borderColor:
                          selectedSize === size
                            ? "#553858"
                            : "rgba(207,157,184,0.3)",
                        background:
                          selectedSize === size ? "#553858" : "transparent",
                        color: selectedSize === size ? "#f3e6ec" : "#cf9db8",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  color: "#f3e6ec",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "#413038",
                    color: "#f3e6ec",
                    border: "1px solid rgba(207,157,184,0.3)",
                    borderRadius: "4px 0 0 4px",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    minWidth: "48px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#2e1f24",
                    color: "#f3e6ec",
                    border: "1px solid rgba(207,157,184,0.3)",
                    borderLeft: "none",
                    borderRight: "none",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "#413038",
                    color: "#f3e6ec",
                    border: "1px solid rgba(207,157,184,0.3)",
                    borderRadius: "0 4px 4px 0",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => handleAddToCart(false)}
                disabled={adding || !product.inStock}
                style={{
                  flex: 1,
                  minWidth: "160px",
                  padding: "12px 20px",
                  borderRadius: "2px",
                  background: "transparent",
                  color: "#f3e6ec",
                  border: "1px solid #553858",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: product.inStock ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <FiShoppingCart size={16} />{" "}
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              {product.inStock && (
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={adding}
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    padding: "12px 20px",
                    borderRadius: "2px",
                    background: "#553858",
                    color: "#f3e6ec",
                    border: "1px solid #553858",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <FiZap size={16} /> Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
