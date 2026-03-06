import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FiPackage } from "react-icons/fi";
import { toast } from "sonner";
import api from "../api/axios.js";
import ProductCard from "./ProductCard.jsx";

// Skeleton card
const SkeletonCard = () => (
  <div className="bg-cocoa-orchid rounded-lg overflow-hidden border border-velvet-rose-mist/10">
    <div
      className="aspect-3/4 animate-[shimmer_1.4s_infinite]"
      style={{
        background:
          "linear-gradient(90deg, #413038 25%, #553858 50%, #413038 75%)",
        backgroundSize: "200% 100%",
      }}
    />
    <div className="p-3.5">
      <div className="h-3.5 bg-royal-plum-veil rounded mb-2 opacity-50" />
      <div className="h-3.5 bg-royal-plum-veil rounded w-3/5 mb-3 opacity-50" />
      <div className="h-9 bg-royal-plum-veil rounded-sm opacity-40" />
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
    <div className="min-h-[calc(100vh-53px)] px-4 py-8 sm:px-6 w-full bg-midnight-truffle">
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Header + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-ivory-blush font-montserrat font-bold text-[clamp(1.5rem,4vw,2rem)] m-0 tracking-[-0.02em]">
              Our Collection
            </h1>
            <p className="text-velvet-rose-mist font-poppins text-sm m-0 mt-1">
              {loading
                ? "Loading…"
                : `${products.length} piece${products.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Sort buttons */}
          <div className="flex gap-1.5 flex-wrap">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`px-3.5 py-1.5 rounded-sm border font-inter text-xs cursor-pointer transition-all duration-200 ${
                  sort === opt.value
                    ? "border-royal-plum-veil bg-royal-plum-veil text-ivory-blush"
                    : "border-velvet-rose-mist/30 bg-transparent text-velvet-rose-mist"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[40vh] gap-4"
          >
            <FiPackage size={48} className="text-royal-plum-veil" />
            <p className="text-velvet-rose-mist font-poppins text-base m-0">
              No products yet. Check back soon!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
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
