import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
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

const inputCls =
  "w-full bg-midnight-truffle border border-velvet-rose-mist/30 text-ivory-blush rounded-md px-3.5 py-2.5 font-poppins text-sm outline-none box-border";

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

  const getTabClass = (active) => {
    return `px-5 py-2 rounded-t-md border-none font-inter text-sm font-medium cursor-pointer transition-all duration-200 ${
      active
        ? "bg-cocoa-orchid text-ivory-blush"
        : "bg-transparent text-velvet-rose-mist"
    }`;
  };

  return (
    <div className="bg-midnight-truffle min-h-screen">
      <Navbar />
      <div className="max-w-[860px] mx-auto px-4 py-8 sm:px-6 w-full">
        <h1 className="text-ivory-blush font-montserrat font-bold text-[clamp(1.4rem,4vw,2rem)] m-0 mb-6">
          My Account
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-velvet-rose-mist/20 mb-0">
          <button
            className={getTabClass(tab === "profile")}
            onClick={() => setTab("profile")}
          >
            <FiUser className="inline-block mr-1.5" />
            Profile
          </button>
          <button
            className={getTabClass(tab === "orders")}
            onClick={() => setTab("orders")}
          >
            <FiPackage className="inline-block mr-1.5" />
            My Orders
          </button>
        </div>

        <div className="bg-cocoa-orchid rounded-tl-none rounded-tr-md rounded-b-md p-6 border border-velvet-rose-mist/20">
          {/* Profile tab */}
          {tab === "profile" && (
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-4 max-w-[480px]"
            >
              <div>
                <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                  Full Name
                </label>
                <input
                  className={inputCls}
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                  Email (read-only)
                </label>
                <input
                  className={`${inputCls} opacity-55`}
                  value={user?.email || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                  Phone Number
                </label>
                <input
                  className={inputCls}
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                  }
                  placeholder="+91 …"
                />
              </div>
              <div>
                <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                  Address
                </label>
                <textarea
                  className={`${inputCls} min-h-[72px] resize-y`}
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
                className={`self-start flex items-center gap-2 text-ivory-blush border-none rounded-sm px-5 py-2.5 font-montserrat font-semibold text-sm ${
                  saving
                    ? "bg-midnight-truffle cursor-not-allowed"
                    : "bg-royal-plum-veil cursor-pointer"
                }`}
              >
                <FiSave size={16} /> {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          )}

          {/* Orders tab */}
          {tab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <FiPackage
                    size={48}
                    className="text-royal-plum-veil mb-4 inline-block"
                  />
                  <p className="text-velvet-rose-mist font-poppins">
                    No orders yet.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="border border-velvet-rose-mist/15 rounded-lg overflow-hidden"
                    >
                      <div
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.orderId
                              ? null
                              : order.orderId,
                          )
                        }
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 cursor-pointer gap-2 sm:gap-0 bg-midnight-truffle"
                      >
                        <div>
                          <p className="text-ivory-blush font-montserrat font-semibold text-[0.85rem] m-0 mb-0.5">
                            #{order.orderId.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-velvet-rose-mist font-inter text-xs m-0">
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
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                          <span
                            style={{
                              background: STATUS_COLORS[order.orderStatus],
                            }}
                            className="text-white text-[0.7rem] font-inter font-semibold px-2.5 py-0.5 rounded-full capitalize"
                          >
                            {order.orderStatus}
                          </span>
                          <span className="text-ivory-blush font-montserrat font-bold text-[0.9rem]">
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
                          className="px-4 py-3 border-t border-velvet-rose-mist/15"
                        >
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between mb-1.5"
                            >
                              <span className="text-ivory-blush font-poppins text-sm">
                                {item.productName} ({item.size}) ×{" "}
                                {item.quantity}
                              </span>
                              <span className="text-velvet-rose-mist font-montserrat text-sm">
                                ₹
                                {(
                                  item.priceAtOrder * item.quantity
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          ))}
                          <div className="mt-2 pt-2 border-t border-velvet-rose-mist/10 flex justify-between">
                            <span className="text-velvet-rose-mist font-inter text-xs">
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
