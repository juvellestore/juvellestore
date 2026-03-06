import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { toast } from "sonner";

const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders/my");
        setOrders(res.data.orders);
      } catch {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "4rem", color: "#f3e6ec" }}>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        <h1
          style={{
            color: "#f3e6ec",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            margin: "0 0 2rem",
          }}
        >
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div
            style={{
              background: "#413038",
              borderRadius: "8px",
              padding: "2rem",
              textAlign: "center",
              border: "1px solid rgba(207,157,184,0.2)",
            }}
          >
            <p
              style={{
                color: "#cf9db8",
                fontFamily: "Poppins, sans-serif",
                fontSize: "1rem",
              }}
            >
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/store")}
              style={{
                background: "#553858",
                color: "#f3e6ec",
                border: "none",
                borderRadius: "4px",
                padding: "10px 24px",
                marginTop: "1rem",
                fontFamily: "Montserrat, sans-serif",
                cursor: "pointer",
              }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: "#413038",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  border: "1px solid rgba(207,157,184,0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        color: "#f3e6ec",
                        fontFamily: "Montserrat, sans-serif",
                        margin: "0 0 0.5rem",
                        fontSize: "1.1rem",
                      }}
                    >
                      Order #{order.orderId.split("-")[0].toUpperCase()}
                    </h3>
                    <p
                      style={{
                        color: "#cf9db8",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.85rem",
                        margin: 0,
                      }}
                    >
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        color: "#f3e6ec",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        margin: "0 0 0.5rem",
                      }}
                    >
                      ₹{order.amount.toLocaleString("en-IN")}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <span
                        style={{
                          background: "rgba(207,157,184,0.1)",
                          color:
                            order.paymentStatus === "paid"
                              ? "#a7f3d0"
                              : "#fcd34d",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontFamily: "Inter, sans-serif",
                          textTransform: "capitalize",
                          border: "1px solid rgba(207,157,184,0.2)",
                        }}
                      >
                        {order.paymentMethod === "razorpay"
                          ? "Razorpay"
                          : "COD"}{" "}
                        - {order.paymentStatus}
                      </span>
                      <span
                        style={{
                          background: "rgba(207,157,184,0.1)",
                          color: "#cf9db8",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontFamily: "Inter, sans-serif",
                          textTransform: "capitalize",
                          border: "1px solid rgba(207,157,184,0.2)",
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(207,157,184,0.1)",
                    paddingTop: "1rem",
                  }}
                >
                  <p
                    style={{
                      color: "#f3e6ec",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Items
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: "#cf9db8",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "0.85rem",
                        }}
                      >
                        <span>
                          {item.quantity} x {item.productName} (Size:{" "}
                          {item.size})
                        </span>
                        <span>
                          ₹
                          {(item.priceAtOrder * item.quantity).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
