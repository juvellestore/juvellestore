import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { toast } from "sonner";

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrder();
    }
  }, [orderId, user]);

  if (authLoading || loading) {
    return (
      <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "4rem", color: "#f3e6ec" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <h2
            style={{ color: "#f3e6ec", fontFamily: "Montserrat, sans-serif" }}
          >
            Order Not Found
          </h2>
          <Link
            to="/store"
            style={{
              color: "#cf9db8",
              textDecoration: "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ← Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
      <Navbar />
      <div
        className="max-w-[600px] w-full mx-auto my-8 sm:my-12 p-6 sm:p-8 text-center"
        style={{
          background: "#413038",
          borderRadius: "8px",
          border: "1px solid rgba(207,157,184,0.2)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#553858",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <span style={{ fontSize: "2rem" }}>🎉</span>
        </div>

        <h1
          style={{
            color: "#f3e6ec",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "2rem",
            margin: "0 0 1rem",
          }}
        >
          Thank you for your order!
        </h1>

        <p
          style={{
            color: "#cf9db8",
            fontFamily: "Poppins, sans-serif",
            fontSize: "1rem",
            margin: "0 0 2rem",
          }}
        >
          We've received your order and are processing it.
        </p>

        <div
          style={{
            background: "rgba(85,56,88,0.15)",
            borderRadius: "6px",
            padding: "1.5rem",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                color: "#cf9db8",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
              }}
            >
              Order ID
            </span>
            <span
              style={{
                color: "#f3e6ec",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              #{order.orderId.substring(0, 8)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                color: "#cf9db8",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
              }}
            >
              Payment Method
            </span>
            <span
              style={{
                color: "#f3e6ec",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                color: "#cf9db8",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.85rem",
              }}
            >
              Payment Status
            </span>
            <span
              style={{
                color: order.paymentStatus === "paid" ? "#a7f3d0" : "#fcd34d",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(207,157,184,0.2)",
              margin: "1rem 0",
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
              Total Amount
            </span>
            <span
              style={{
                color: "#f3e6ec",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
              }}
            >
              ₹{order.amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link
            to="/my-orders"
            style={{
              flex: 1,
              background: "#413038",
              color: "#f3e6ec",
              border: "1px solid rgba(207,157,184,0.3)",
              borderRadius: "4px",
              padding: "12px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            View My Orders
          </Link>
          <Link
            to="/store"
            style={{
              flex: 1,
              background: "#553858",
              color: "#f3e6ec",
              border: "none",
              borderRadius: "4px",
              padding: "12px",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
