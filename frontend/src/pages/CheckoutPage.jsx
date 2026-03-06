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

// Simple load script function for Razorpay
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const { user, loading: authLoading, updateCartItemCount } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

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

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Razorpay order on the server (no DB order created yet)
      const { data } = await api.post("/api/payment/create-order", {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
      });

      if (!data.success) {
        toast.error(data.detail || "Could not create Razorpay order");
        setLoading(false);
        return;
      }

      // 2. Configure checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Juvelle",
        description: "Test Transaction for Juvelle Store",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify signature & create order in DB on success
            const verifyRes = await api.post("/api/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              fullName: form.fullName,
              phoneNumber: form.phoneNumber,
              address: form.address,
            });

            if (verifyRes.data.success) {
              await clearCart();
              if (updateCartItemCount) updateCartItemCount(0);
              toast.success("Payment successful!");
              navigate(
                `/order-success?orderId=${verifyRes.data.order.orderId}`,
              );
            }
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Payment verification failed",
            );
          }
        },
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: form.phoneNumber,
        },
        theme: {
          color: "#cf9db8",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to initiate payment",
      );
    } finally {
      // Don't disable button while Razorpay is open waiting for handler,
      // but unlock it if order creation fails.
      setLoading(false);
    }
  };

  const placeCodOrder = async () => {
    try {
      const { data } = await api.post("/api/orders", {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        address: form.address,
        paymentStatus: "pending", // Controller handles this mapping explicitly
      });
      await clearCart();
      if (updateCartItemCount) updateCartItemCount(0);
      toast.success("Order placed successfully!");
      navigate(`/order-success?orderId=${data.order.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place COD order");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);

    if (paymentMethod === "razorpay") {
      await displayRazorpay();
    } else {
      await placeCodOrder();
    }
  };

  return (
    <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
      <Navbar />
      <div className="max-w-[900px] mx-auto px-4 py-8 sm:px-6 w-full">
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

        <div className="flex flex-col md:grid md:grid-cols-[1fr_340px] gap-8 items-start w-full">
          {/* Main Content Area */}
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
                Payment Method
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    border:
                      paymentMethod === "razorpay"
                        ? "2px solid #cf9db8"
                        : "2px solid rgba(207,157,184,0.2)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background:
                      paymentMethod === "razorpay"
                        ? "rgba(207,157,184,0.05)"
                        : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    style={{
                      accentColor: "#cf9db8",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <div>
                    <span
                      style={{
                        color: "#f3e6ec",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      Pay Online (Razorpay)
                    </span>
                    <span
                      style={{
                        color: "#cf9db8",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.8rem",
                      }}
                    >
                      Cards, UPI, NetBanking, Wallets
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    border:
                      paymentMethod === "cod"
                        ? "2px solid #cf9db8"
                        : "2px solid rgba(207,157,184,0.2)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background:
                      paymentMethod === "cod"
                        ? "rgba(207,157,184,0.05)"
                        : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    style={{
                      accentColor: "#cf9db8",
                      width: "18px",
                      height: "18px",
                      cursor: "pointer",
                    }}
                  />
                  <div>
                    <span
                      style={{
                        color: "#f3e6ec",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      Cash on Delivery
                    </span>
                    <span
                      style={{
                        color: "#cf9db8",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "0.8rem",
                      }}
                    >
                      Pay when you receive the order
                    </span>
                  </div>
                </label>
              </div>
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
                padding: "16px",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {loading
                ? "Processing…"
                : paymentMethod === "razorpay"
                  ? "Proceed to Payment"
                  : "Place Order (COD)"}
            </button>
          </form>

          {/* Order summary */}
          <div
            className="w-full md:sticky top-[80px]"
            style={{
              background: "#413038",
              borderRadius: "8px",
              padding: "1.5rem",
              border: "1px solid rgba(207,157,184,0.2)",
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
