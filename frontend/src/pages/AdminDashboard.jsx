import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { generateBillingPDF, generateShippingPDF } from "../utils/pdfUtils.js";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imgUrl = (img) =>
  img?.startsWith("http") ? img : `${VITE_API_URL}${img}`;
const SIZES = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
const ORDER_STATUSES = [
  "active",
  "processing",
  "shipped",
  "fulfilled",
  "cancelled",
];
const STATUS_COLORS = {
  active: "#cf9db8",
  processing: "#9d7c85",
  shipped: "#7b5ea7",
  fulfilled: "#4a7c59",
  cancelled: "#7c4a4a",
};

const StatCard = ({ icon, label, value, color }) => {
  const Icon = icon;
  return (
    <div className="bg-cocoa-orchid rounded-lg py-5 px-6 border border-velvet-rose-mist/15 flex items-center gap-4">
      <div
        className="rounded-lg p-3 flex"
        style={{ background: color || "#553858" }}
      >
        <Icon size={22} className="text-ivory-blush" />
      </div>
      <div>
        <p className="text-velvet-rose-mist font-inter text-xs m-0 mb-0.5 uppercase tracking-[0.05em]">
          {label}
        </p>
        <p className="text-ivory-blush font-montserrat font-bold text-[1.4rem] m-0">
          {value}
        </p>
      </div>
    </div>
  );
};

const inputCls =
  "w-full bg-midnight-truffle border border-velvet-rose-mist/30 text-ivory-blush rounded-md px-3 py-[9px] font-poppins text-[0.85rem] outline-none box-border uppercase-placeholder placeholder:text-velvet-rose-mist/60 focus:border-velvet-rose-mist focus:ring-1 focus:ring-velvet-rose-mist transition-all";

const ProductFormModal = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState({
    productName: product?.productName || "",
    description: product?.description || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    sizes: product?.sizes || [],
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    stockQuantity: product?.stockQuantity ?? "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState(
    product?.images?.map((img) => imgUrl(img)) || [],
  );
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const toggleSize = (s) =>
    setForm((p) => ({
      ...p,
      sizes: p.sizes.includes(s)
        ? p.sizes.filter((x) => x !== s)
        : [...p.sizes, s],
    }));

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "sizes") fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      files.forEach((f) => fd.append("images", f));

      if (product) {
        await api.put(`/api/products/${product._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated!");
      } else {
        await api.post("/api/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-midnight-truffle/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.92 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-midnight-truffle border border-velvet-rose-mist/30 rounded-xl p-6 w-full max-w-[540px] max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-ivory-blush font-montserrat font-bold text-[1.1rem] m-0">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-velvet-rose-mist cursor-pointer hover:text-red-400 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className={inputCls}
            placeholder="Product Name *"
            value={form.productName}
            onChange={(e) =>
              setForm((p) => ({ ...p, productName: e.target.value }))
            }
            required
          />
          <textarea
            className={`${inputCls} min-h-[72px] resize-y`}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-2.5">
            <input
              className={inputCls}
              type="number"
              placeholder="Price (₹) *"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              required
            />
            <input
              className={inputCls}
              type="number"
              placeholder="Original Price (₹)"
              value={form.originalPrice}
              onChange={(e) =>
                setForm((p) => ({ ...p, originalPrice: e.target.value }))
              }
            />
            <input
              className={`${inputCls} col-span-2`}
              type="number"
              min="0"
              placeholder="Stock Qty (blank = unlimited)"
              value={form.stockQuantity}
              onChange={(e) =>
                setForm((p) => ({ ...p, stockQuantity: e.target.value }))
              }
            />
          </div>

          {/* Sizes */}
          <div>
            <p className="text-velvet-rose-mist font-inter text-xs uppercase tracking-[0.05em] m-0 mb-1.5">
              Sizes
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  className={`px-3 py-1.5 rounded-md border font-inter text-sm cursor-pointer transition-colors ${
                    form.sizes.includes(s)
                      ? "bg-royal-plum-veil border-royal-plum-veil text-ivory-blush"
                      : "bg-transparent border-velvet-rose-mist/30 text-velvet-rose-mist hover:border-velvet-rose-mist/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            {[
              ["inStock", "In Stock"],
              ["featured", "Featured"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer text-velvet-rose-mist font-inter text-[0.85rem] hover:text-ivory-blush transition-colors"
              >
                <input
                  type="checkbox"
                  checked={form[key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.checked }))
                  }
                  className="w-4 h-4 accent-royal-plum-veil cursor-pointer"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Images */}
          <div>
            <p className="text-velvet-rose-mist font-inter text-xs uppercase tracking-[0.05em] m-0 mb-1.5">
              Images (up to 5)
            </p>
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-full bg-cocoa-orchid text-velvet-rose-mist border border-dashed border-velvet-rose-mist/40 rounded-md p-2.5 cursor-pointer font-poppins text-[0.85rem] hover:border-velvet-rose-mist hover:text-ivory-blush transition-colors"
            >
              Click to select images
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiles}
              className="hidden"
            />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-16 h-20 object-cover rounded border border-velvet-rose-mist/30"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full border-none rounded-sm p-[11px] font-montserrat font-bold text-[0.9rem] ${
              loading
                ? "bg-cocoa-orchid text-white/50 cursor-not-allowed"
                : "bg-royal-plum-veil text-ivory-blush cursor-pointer hover:bg-royal-plum-veil/90"
            } transition-colors mt-2`}
          >
            {loading
              ? "Saving…"
              : product
                ? "Update Product"
                : "Create Product"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productModal, setProductModal] = useState(null); // null | 'new' | product object
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") navigate("/");
    }
  }, [user, authLoading, navigate]);

  const loadData = async () => {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/products"),
        api.get("/api/admin/orders"),
      ]);
      setStats(statsRes.data.stats);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    } catch {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((p) => p.filter((x) => x._id !== id));
      toast.success("Product deleted");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}`, { orderStatus: status });
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, orderStatus: status } : o,
        ),
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const tabStyle = (active) =>
    `px-5 py-2 rounded-t-md border-none font-inter text-sm font-medium cursor-pointer transition-colors ${
      active
        ? "bg-cocoa-orchid text-ivory-blush"
        : "bg-transparent text-velvet-rose-mist hover:text-ivory-blush hover:bg-cocoa-orchid/50"
    }`;

  if (loading)
    return (
      <div className="bg-midnight-truffle min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <span className="text-velvet-rose-mist font-poppins text-lg animate-pulse">
            Loading admin data...
          </span>
        </div>
      </div>
    );

  return (
    <div className="bg-midnight-truffle min-h-screen">
      <Navbar />
      <div className="max-w-[1200px] mx-auto py-8 px-6">
        <h1 className="text-ivory-blush font-montserrat font-bold text-[clamp(1.4rem,4vw,2rem)] m-0 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-8">
            <StatCard
              icon={FiPackage}
              label="Products"
              value={stats.totalProducts}
              color="#553858"
            />
            <StatCard
              icon={FiShoppingBag}
              label="Active Orders"
              value={stats.activeOrders}
              color="#413038"
            />
            <StatCard
              icon={FiUsers}
              label="Users"
              value={stats.totalUsers}
              color="#413038"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-velvet-rose-mist/20">
          <button
            className={tabStyle(tab === "products")}
            onClick={() => setTab("products")}
          >
            Products
          </button>
          <button
            className={tabStyle(tab === "orders")}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>
        </div>

        <div className="bg-cocoa-orchid rounded-b-lg rounded-tr-lg p-6 border border-velvet-rose-mist/20">
          {/* Products tab */}
          {tab === "products" && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setProductModal("new")}
                  className="flex items-center gap-1.5 bg-royal-plum-veil text-ivory-blush border-none rounded-sm px-4 py-2 font-montserrat font-semibold text-[0.85rem] cursor-pointer hover:bg-royal-plum-veil/90 transition-colors"
                >
                  <FiPlus size={16} /> Add Product
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {products.length === 0 ? (
                  <p className="text-velvet-rose-mist font-poppins text-center py-8 m-0">
                    No products yet.
                  </p>
                ) : (
                  products.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-3 bg-midnight-truffle rounded-md py-2.5 px-3.5 border border-velvet-rose-mist/10"
                    >
                      {p.images?.[0] && (
                        <img
                          src={imgUrl(p.images[0])}
                          alt={p.productName}
                          className="w-12 h-16 object-cover rounded shadow-sm"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-ivory-blush font-montserrat font-semibold text-[0.875rem] m-0 mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
                          {p.productName}
                        </p>
                        <p className="text-velvet-rose-mist font-inter text-xs m-0">
                          ₹{p.price.toLocaleString("en-IN")}{" "}
                          {p.stockQuantity !== null &&
                          p.stockQuantity !== undefined
                            ? `• Stock: ${p.stockQuantity}`
                            : "• Unlimited stock"}{" "}
                          {p.featured && "• Featured"}{" "}
                          {!p.inStock && "• Out of Stock"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setProductModal(p)}
                          className="bg-transparent border border-velvet-rose-mist/30 text-velvet-rose-mist rounded px-2.5 py-1.5 cursor-pointer flex items-center hover:bg-velvet-rose-mist/10 hover:text-ivory-blush transition-colors"
                          title="Edit Product"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(p._id)}
                          className="bg-transparent border border-red-900/50 text-red-400 rounded px-2.5 py-1.5 cursor-pointer flex items-center hover:bg-red-900/20 hover:text-red-300 transition-colors"
                          title="Delete Product"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Orders tab */}
          {tab === "orders" && (
            <div className="flex flex-col gap-2">
              {orders.length === 0 ? (
                <p className="text-velvet-rose-mist font-poppins text-center py-8 m-0">
                  No orders yet.
                </p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="border border-velvet-rose-mist/10 rounded-lg overflow-hidden"
                  >
                    <div
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.orderId
                            ? null
                            : order.orderId,
                        )
                      }
                      className="flex items-center gap-3 flex-wrap py-2.5 px-3.5 cursor-pointer bg-midnight-truffle hover:bg-midnight-truffle/80 transition-colors"
                    >
                      <div className="flex-1 min-w-[160px]">
                        <p className="text-ivory-blush font-montserrat font-semibold text-[0.82rem] m-0 mb-0.5">
                          #{order.orderId.split("-")[0].toUpperCase()}
                        </p>
                        <p className="text-velvet-rose-mist font-inter text-[0.72rem] m-0 mb-0.5">
                          {order.userId?.fullName || order.fullName}
                        </p>
                        <p className="text-royal-plum-veil font-inter text-[0.68rem] m-0">
                          {new Date(order.orderDate).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-ivory-blush font-montserrat font-bold text-[0.88rem] block">
                          ₹{order.amount.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`font-inter text-[0.65rem] capitalize ${
                            order.paymentStatus === "paid"
                              ? "text-green-600/80"
                              : "text-royal-plum-veil"
                          }`}
                        >
                          {order.paymentMethod === "razorpay"
                            ? "Razorpay"
                            : "COD"}{" "}
                          · {order.paymentStatus}
                        </span>
                      </div>
                      {/* Status dropdown */}
                      <select
                        value={order.orderStatus}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order.orderId, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-white border-none rounded-full px-2.5 py-1 font-inter text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50"
                        style={{
                          background: STATUS_COLORS[order.orderStatus],
                        }}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option
                            key={s}
                            value={s}
                            className="bg-midnight-truffle text-ivory-blush"
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                      {expandedOrder === order.orderId ? (
                        <FiChevronUp color="#cf9db8" size={16} />
                      ) : (
                        <FiChevronDown color="#cf9db8" size={16} />
                      )}
                    </div>
                    {expandedOrder === order.orderId && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        className="p-3.5 border-t border-velvet-rose-mist/10 bg-midnight-truffle/50"
                      >
                        {/* Customer Info */}
                        <div className="bg-velvet-rose-mist/6 rounded-md py-2.5 px-3 mb-2.5 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-y-1.5 gap-x-4">
                          <div>
                            <p className="text-velvet-rose-mist font-inter text-[0.68rem] uppercase tracking-[0.05em] m-0 mb-0.5">
                              Order ID
                            </p>
                            <p className="text-ivory-blush font-poppins text-[0.78rem] m-0 break-all opacity-80">
                              {order.orderId}
                            </p>
                          </div>
                          <div>
                            <p className="text-velvet-rose-mist font-inter text-[0.68rem] uppercase tracking-[0.05em] m-0 mb-0.5">
                              Date & Time
                            </p>
                            <p className="text-ivory-blush font-poppins text-xs m-0">
                              {new Date(order.orderDate).toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-velvet-rose-mist font-inter text-[0.68rem] uppercase tracking-[0.05em] m-0 mb-0.5">
                              Customer
                            </p>
                            <p className="text-ivory-blush font-poppins text-xs m-0">
                              {order.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="text-velvet-rose-mist font-inter text-[0.68rem] uppercase tracking-[0.05em] m-0 mb-0.5">
                              Email
                            </p>
                            <p className="text-ivory-blush font-poppins text-xs m-0">
                              {order.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-velvet-rose-mist font-inter text-[0.68rem] uppercase tracking-[0.05em] m-0 mb-0.5">
                              Phone
                            </p>
                            <p className="text-ivory-blush font-poppins text-xs m-0">
                              {order.phoneNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-velvet-rose-mist font-inter text-[0.68rem] uppercase tracking-[0.05em] m-0 mb-0.5">
                              Payment
                            </p>
                            <p className="text-ivory-blush font-poppins text-xs m-0 capitalize">
                              {order.paymentMethod === "razorpay"
                                ? "Razorpay"
                                : "COD"}{" "}
                              - {order.paymentStatus}
                            </p>
                          </div>
                          <div className="col-span-full">
                            <p className="text-velvet-rose-mist font-inter text-[0.68rem] uppercase tracking-[0.05em] m-0 mb-0.5">
                              Delivery Address
                            </p>
                            <p className="text-ivory-blush font-poppins text-xs m-0">
                              📍 {order.address}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <p className="text-velvet-rose-mist font-inter text-[0.72rem] uppercase tracking-[0.05em] m-0 mb-1.5 mt-4">
                          Items
                        </p>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between mb-1">
                            <span className="text-ivory-blush font-poppins text-xs">
                              {item.productName} ({item.size}) × {item.quantity}
                            </span>
                            <span className="text-velvet-rose-mist font-montserrat text-xs">
                              ₹
                              {(
                                item.priceAtOrder * item.quantity
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}

                        {/* PDF Actions */}
                        <div className="flex gap-3 mt-4 pt-4 border-t border-velvet-rose-mist/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              generateBillingPDF(order);
                            }}
                            className="flex-1 bg-royal-plum-veil text-ivory-blush border-none rounded-sm py-2 font-montserrat font-semibold text-[0.85rem] cursor-pointer hover:bg-royal-plum-veil/90 transition-colors"
                          >
                            Generate Billing PDF
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              generateShippingPDF(order);
                            }}
                            className="flex-1 bg-cocoa-orchid text-ivory-blush border-none rounded-sm py-2 font-montserrat font-semibold text-[0.85rem] cursor-pointer hover:bg-cocoa-orchid/90 transition-colors"
                          >
                            Generate Shipping Label
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-midnight-truffle/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-midnight-truffle border border-red-900/30 rounded-xl p-6 w-full max-w-[400px] text-center shadow-xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-900/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 size={24} />
              </div>
              <h3 className="text-ivory-blush font-montserrat font-bold text-lg m-0 mb-2">
                Delete Product?
              </h3>
              <p className="text-velvet-rose-mist font-poppins text-[0.85rem] m-0 mb-6">
                This action cannot be undone. Are you sure you want to delete
                this product?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-transparent border border-velvet-rose-mist/30 text-velvet-rose-mist rounded-md py-2.5 font-montserrat font-semibold text-[0.85rem] cursor-pointer hover:bg-velvet-rose-mist/10 hover:text-ivory-blush transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProduct(confirmDelete)}
                  className="flex-1 bg-red-900/40 border border-red-900/50 text-red-100 rounded-md py-2.5 font-montserrat font-semibold text-[0.85rem] cursor-pointer hover:bg-red-900/60 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {productModal && (
          <ProductFormModal
            product={productModal === "new" ? null : productModal}
            onClose={() => setProductModal(null)}
            onSaved={loadData}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
