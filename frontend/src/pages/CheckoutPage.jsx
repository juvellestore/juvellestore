import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/axios.js";

const inputCls = {
  width: "100%",
  background: "#413038",
  border: "1px solid rgba(207,157,184,0.3)",
  color: "#f3e6ec",
  borderRadius: "6px",
  padding: "10px 14px",
  fontFamily: "Poppins, sans-serif",
  fontSize: "0.875rem",
  outline: "none",
  boxSizing: "border-box",
};

const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/orders", {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        paymentStatus: "pending",
      });
      toast.success("Order placed! We'll contact you for payment.");
      await clearCart();
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        <h1
          style={{
            color: "#f3e6ec",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            margin: "0 0 2rem",
          }}
        >
          Checkout
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Shipping form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: "#413038",
                borderRadius: "8px",
                padding: "1.5rem",
                border: "1px solid rgba(207,157,184,0.2)",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  color: "#f3e6ec",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  margin: "0 0 1.25rem",
                }}
              >
                Shipping Details
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      color: "#cf9db8",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Full Name *
                  </label>
                  <input
                    style={inputCls}
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: "#cf9db8",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    style={{ ...inputCls, opacity: 0.6 }}
                    value={form.email}
                    readOnly
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: "#cf9db8",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Phone Number *
                  </label>
                  <input
                    style={inputCls}
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      color: "#cf9db8",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Delivery Address *
                  </label>
                  <textarea
                    style={{
                      ...inputCls,
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(85,56,88,0.15)",
                border: "1px solid rgba(85,56,88,0.4)",
                borderRadius: "6px",
                padding: "12px 16px",
                marginBottom: "1.5rem",
              }}
            >
              <p
                style={{
                  color: "#cf9db8",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.8rem",
                  margin: 0,
                }}
              >
                💳{" "}
                <strong style={{ color: "#f3e6ec" }}>
                  Payment on confirmation:
                </strong>{" "}
                We will reach out to you shortly after your order is placed with
                payment instructions.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#413038" : "#553858",
                color: "#f3e6ec",
                border: "none",
                borderRadius: "2px",
                padding: "12px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Placing Order…" : "Place Order"}
            </button>
          </form>

          {/* Order summary */}
          <div
            style={{
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
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: "#f3e6ec",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "0.8rem",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.productId?.productName} × {item.quantity}
                  </p>
                  <p
                    style={{
                      color: "#cf9db8",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.7rem",
                      margin: 0,
                    }}
                  >
                    Size: {item.size}
                  </p>
                </div>
                <span
                  style={{
                    color: "#f3e6ec",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    flexShrink: 0,
                    marginLeft: "12px",
                  }}
                >
                  ₹
                  {(
                    (item.productId?.price || 0) * item.quantity
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid rgba(207,157,184,0.2)",
                margin: "12px 0",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  color: "#f3e6ec",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
                Total
              </span>
              <span
                style={{
                  color: "#f3e6ec",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 700,
                }}
              >
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
