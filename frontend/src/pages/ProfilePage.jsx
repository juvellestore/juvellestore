import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiPackage,
  FiChevronDown,
  FiChevronUp,
  FiSave,
} from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
  active: "#cf9db8",
  processing: "#9d7c85",
  shipped: "#7b5ea7",
  fulfilled: "#4a7c59",
  cancelled: "#7c4a4a",
};

const inputCls = {
  width: "100%",
  background: "#2e1f24",
  border: "1px solid rgba(207,157,184,0.3)",
  color: "#f3e6ec",
  borderRadius: "6px",
  padding: "10px 14px",
  fontFamily: "Poppins, sans-serif",
  fontSize: "0.875rem",
  outline: "none",
  boxSizing: "border-box",
};

const ProfilePage = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user)
      setForm({
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
  }, [user]);

  useEffect(() => {
    if (tab === "orders") {
      api
        .get("/api/orders/my")
        .then((r) => setOrders(r.data.orders || []))
        .catch(() => toast.error("Failed to load orders"));
    }
  }, [tab]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/api/auth/me", form);
      updateUser(res.data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const tabStyle = (active) => ({
    padding: "8px 20px",
    borderRadius: "6px 6px 0 0",
    border: "none",
    background: active ? "#413038" : "transparent",
    color: active ? "#f3e6ec" : "#cf9db8",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  });

  return (
    <div style={{ background: "#2e1f24", minHeight: "100vh" }}>
      <Navbar />
      <div
        style={{ maxWidth: "860px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        <h1
          style={{
            color: "#f3e6ec",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            margin: "0 0 1.5rem",
          }}
        >
          My Account
        </h1>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid rgba(207,157,184,0.2)",
            marginBottom: "0",
          }}
        >
          <button
            style={tabStyle(tab === "profile")}
            onClick={() => setTab("profile")}
          >
            <FiUser style={{ marginRight: "6px" }} />
            Profile
          </button>
          <button
            style={tabStyle(tab === "orders")}
            onClick={() => setTab("orders")}
          >
            <FiPackage style={{ marginRight: "6px" }} />
            My Orders
          </button>
        </div>

        <div
          style={{
            background: "#413038",
            borderRadius: "0 8px 8px 8px",
            padding: "1.5rem",
            border: "1px solid rgba(207,157,184,0.2)",
          }}
        >
          {/* Profile tab */}
          {tab === "profile" && (
            <form
              onSubmit={handleSave}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "480px",
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
                  Full Name
                </label>
                <input
                  style={inputCls}
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="Your name"
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
                  Email (read-only)
                </label>
                <input
                  style={{ ...inputCls, opacity: 0.55 }}
                  value={user?.email || ""}
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
                  Phone Number
                </label>
                <input
                  style={inputCls}
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                  placeholder="+91 …"
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
                  Address
                </label>
                <textarea
                  style={{ ...inputCls, minHeight: "72px", resize: "vertical" }}
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="Your delivery address"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: saving ? "#2e1f24" : "#553858",
                  color: "#f3e6ec",
                  border: "none",
                  borderRadius: "2px",
                  padding: "10px 20px",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                <FiSave size={16} /> {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          )}

          {/* Orders tab */}
          {tab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 0" }}>
                  <FiPackage
                    size={48}
                    style={{ color: "#553858", marginBottom: "1rem" }}
                  />
                  <p
                    style={{
                      color: "#cf9db8",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    No orders yet.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      style={{
                        border: "1px solid rgba(207,157,184,0.15)",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.orderId
                              ? null
                              : order.orderId,
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "12px 16px",
                          cursor: "pointer",
                          background: "#2e1f24",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              color: "#f3e6ec",
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                              fontSize: "0.85rem",
                              margin: "0 0 2px",
                            }}
                          >
                            #{order.orderId.slice(-8).toUpperCase()}
                          </p>
                          <p
                            style={{
                              color: "#cf9db8",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.75rem",
                              margin: 0,
                            }}
                          >
                            {new Date(order.orderDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <span
                            style={{
                              background: STATUS_COLORS[order.orderStatus],
                              color: "#fff",
                              fontSize: "0.7rem",
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 600,
                              padding: "2px 10px",
                              borderRadius: "20px",
                              textTransform: "capitalize",
                            }}
                          >
                            {order.orderStatus}
                          </span>
                          <span
                            style={{
                              color: "#f3e6ec",
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                            }}
                          >
                            ₹{order.amount.toLocaleString("en-IN")}
                          </span>
                          {expandedOrder === order.orderId ? (
                            <FiChevronUp color="#cf9db8" />
                          ) : (
                            <FiChevronDown color="#cf9db8" />
                          )}
                        </div>
                      </div>
                      {expandedOrder === order.orderId && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          style={{
                            padding: "12px 16px",
                            borderTop: "1px solid rgba(207,157,184,0.15)",
                          }}
                        >
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "6px",
                              }}
                            >
                              <span
                                style={{
                                  color: "#f3e6ec",
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "0.8rem",
                                }}
                              >
                                {item.productName} ({item.size}) ×{" "}
                                {item.quantity}
                              </span>
                              <span
                                style={{
                                  color: "#cf9db8",
                                  fontFamily: "Montserrat, sans-serif",
                                  fontSize: "0.8rem",
                                }}
                              >
                                ₹
                                {(
                                  item.priceAtOrder * item.quantity
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                          <div
                            style={{
                              marginTop: "8px",
                              paddingTop: "8px",
                              borderTop: "1px solid rgba(207,157,184,0.1)",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span
                              style={{
                                color: "#cf9db8",
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.75rem",
                              }}
                            >
                              Address: {order.address}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
