import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";
import { toast } from "sonner";
import api from "../api/axios.js";
import ProductCard from "./ProductCard.jsx";

// Skeleton card
const SkeletonCard = () => (
  <div
    style={{
      background: "#413038",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid rgba(207,157,184,0.1)",
    }}
  >
    <div
      style={{
        aspectRatio: "3/4",
        background:
          "linear-gradient(90deg, #413038 25%, #553858 50%, #413038 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
    <div style={{ padding: "0.875rem" }}>
      <div
        style={{
          height: "14px",
          background: "#553858",
          borderRadius: "4px",
          marginBottom: "8px",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          height: "14px",
          background: "#553858",
          borderRadius: "4px",
          width: "60%",
          marginBottom: "12px",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          height: "36px",
          background: "#553858",
          borderRadius: "2px",
          opacity: 0.4,
        }}
      />
    </div>
    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
  </div>
);

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Featured", value: "featured" },
];

const Store = ({ onOpenAuth }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products?sort=${sort}`);
        setProducts(res.data.products || []);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sort]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 53px)",
        background: "#2e1f24",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header + Sort */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                color: "#f3e6ec",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Our Collection
            </h1>
            <p
              style={{
                color: "#cf9db8",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.875rem",
                margin: "4px 0 0",
              }}
            >
              {loading
                ? "Loading…"
                : `${products.length} piece${products.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Sort buttons */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "2px",
                  border: "1px solid",
                  borderColor:
                    sort === opt.value ? "#553858" : "rgba(207,157,184,0.3)",
                  background: sort === opt.value ? "#553858" : "transparent",
                  color: sort === opt.value ? "#f3e6ec" : "#cf9db8",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vh",
              gap: "1rem",
            }}
          >
            <FiPackage size={48} style={{ color: "#553858" }} />
            <p
              style={{
                color: "#cf9db8",
                fontFamily: "Poppins, sans-serif",
                fontSize: "1rem",
                margin: 0,
              }}
            >
              No products yet. Check back soon!
            </p>
          </motion.div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onOpenAuth={onOpenAuth} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
