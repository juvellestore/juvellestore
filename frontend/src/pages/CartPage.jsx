import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import { useCart } from "../context/CartContext.jsx";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CartPage = () => {
  const { cartItems, cartCount, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  const handleRemove = async (cartItemId) => {
    try {
      await removeItem(cartItemId);
      toast.success("Item removed");
    } catch {
      toast.error("Could not remove item");
    }
  };

  const handleUpdateQty = async (cartItemId, qty) => {
    if (qty < 1) return;
    try {
      await updateQty(cartItemId, qty);
    } catch {
      toast.error("Could not update quantity");
    }
  };

  return (
    <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
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
            marginBottom: "1.5rem",
          }}
        >
          <FiArrowLeft size={16} /> Continue Shopping
        </Link>

        <h1
          style={{
            color: "#f3e6ec",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            margin: "0 0 1.5rem",
          }}
        >
          Your Cart{" "}
          {cartCount > 0 && (
            <span
              style={{ color: "#cf9db8", fontSize: "1rem", fontWeight: 400 }}
            >
              ({cartCount} item{cartCount !== 1 ? "s" : ""})
            </span>
          )}
        </h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "4rem 0" }}
          >
            <FiShoppingBag
              size={56}
              style={{ color: "#553858", marginBottom: "1rem" }}
            />
            <p
              style={{
                color: "#cf9db8",
                fontFamily: "Poppins, sans-serif",
                fontSize: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              Your cart is empty.
            </p>
            <Link
              to="/store"
              style={{
                background: "#553858",
                color: "#f3e6ec",
                padding: "10px 24px",
                borderRadius: "2px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "0.875rem",
              }}
            >
              Browse Collection
            </Link>
          </motion.div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "start",
            }}
          >
            {/* Items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {cartItems.map((item) => {
                const product = item.productId;
                const imgSrc = product?.images?.[0]
                  ? `${VITE_API_URL}${product.images[0]}`
                  : null;
                return (
                  <motion.div
                    key={item.cartItemId}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      background: "#413038",
                      borderRadius: "8px",
                      padding: "1rem",
                      border: "1px solid rgba(207,157,184,0.15)",
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        width: "72px",
                        height: "96px",
                        background: "#2e1f24",
                        borderRadius: "4px",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product?.productName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : null}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          color: "#f3e6ec",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          margin: "0 0 4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product?.productName || "Product"}
                      </p>
                      <p
                        style={{
                          color: "#cf9db8",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.8rem",
                          margin: "0 0 8px",
                        }}
                      >
                        Size: {item.size}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0",
                        }}
                      >
                        <button
                          onClick={() =>
                            handleUpdateQty(item.cartItemId, item.quantity - 1)
                          }
                          style={{
                            width: "28px",
                            height: "28px",
                            background: "#2e1f24",
                            color: "#f3e6ec",
                            border: "1px solid rgba(207,157,184,0.3)",
                            borderRadius: "4px 0 0 4px",
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                        >
                          −
                        </button>
                        <span
                          style={{
                            minWidth: "36px",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#2e1f24",
                            color: "#f3e6ec",
                            border: "1px solid rgba(207,157,184,0.3)",
                            borderLeft: "none",
                            borderRight: "none",
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQty(item.cartItemId, item.quantity + 1)
                          }
                          style={{
                            width: "28px",
                            height: "28px",
                            background: "#2e1f24",
                            color: "#f3e6ec",
                            border: "1px solid rgba(207,157,184,0.3)",
                            borderRadius: "0 4px 4px 0",
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price + remove */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p
                        style={{
                          color: "#f3e6ec",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          margin: "0 0 8px",
                        }}
                      >
                        ₹
                        {((product?.price || 0) * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                      <button
                        onClick={() => handleRemove(item.cartItemId)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#cf9db8",
                          cursor: "pointer",
                          padding: "4px",
                        }}
                        title="Remove"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary */}
            <div
              style={{
                minWidth: "220px",
                background: "#413038",
                borderRadius: "8px",
                padding: "1.5rem",
                border: "1px solid rgba(207,157,184,0.2)",
                position: "sticky",
                top: "80px",
              }}
            >
              <h2
                style={{
                  color: "#f3e6ec",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  margin: "0 0 1rem",
                }}
              >
                Order Summary
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    color: "#cf9db8",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.875rem",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    color: "#f3e6ec",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(207,157,184,0.2)",
                  margin: "12px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    color: "#f3e6ec",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    color: "#f3e6ec",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  background: "#553858",
                  color: "#f3e6ec",
                  border: "none",
                  borderRadius: "2px",
                  padding: "10px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
