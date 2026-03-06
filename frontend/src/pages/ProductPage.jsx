import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FiShoppingCart,
  FiArrowLeft,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/axios.js";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imgUrl = (img) =>
  img?.startsWith("http") ? img : `${VITE_API_URL}${img}`;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const nextImage = () => setMainImg((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setMainImg((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data.product);
        if (res.data.product.sizes?.length > 0)
          setSelectedSize(res.data.product.sizes[0]);
      } catch {
        toast.error("Product not found");
        navigate("/store");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleAddToCart = async (buyNow = false) => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error("Please select a size");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, selectedSize || "Free Size", quantity);
      toast.success("Added to cart!");
      if (buyNow) navigate("/checkout");
    } catch {
      toast.error("Could not add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-midnight-truffle min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <span className="text-velvet-rose-mist font-poppins">Loading…</span>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length > 0 ? product.images.map((img) => imgUrl(img)) : [];

  return (
    <div className="bg-midnight-truffle min-h-screen">
      <Navbar />
      <div className="max-w-[1100px] mx-auto px-4 py-8 sm:px-6 w-full">
        {/* Breadcrumb */}
        <Link
          to="/store"
          className="inline-flex items-center gap-1.5 text-velvet-rose-mist font-inter text-[0.85rem] no-underline mb-8 hover:text-ivory-blush transition-colors"
        >
          <FiArrowLeft size={16} /> Back to Collection
        </Link>

        {/* Mobile Image Carousel */}
        {images.length > 0 && (
          <div className="md:hidden relative w-full aspect-3/4 group mb-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={mainImg}
                src={images[mainImg]}
                alt={product.productName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-midnight-truffle/60 border border-velvet-rose-mist/30 text-ivory-blush flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-midnight-truffle/60 border border-velvet-rose-mist/30 text-ivory-blush flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === mainImg
                          ? "bg-ivory-blush"
                          : "bg-velvet-rose-mist/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-start w-full">
          {/* Image gallery */}
          <div className="hidden md:block">
            {" "}
            {/* Hide on mobile */}
            <motion.div
              key={mainImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-cocoa-orchid rounded-lg overflow-hidden aspect-3/4 mb-3"
            >
              {images.length > 0 ? (
                <img
                  src={images[mainImg]}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-velvet-rose-mist font-poppins">
                    No image
                  </span>
                </div>
              )}
            </motion.div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    className={`w-[72px] h-[96px] rounded bg-cocoa-orchid overflow-hidden p-0 cursor-pointer border-2 transition-all ${
                      i === mainImg
                        ? "border-royal-plum-veil"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full aspect-3/4 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {product.featured && (
              <span className="inline-block bg-royal-plum-veil text-ivory-blush text-[0.65rem] font-inter font-bold px-2.5 py-1 rounded-full mb-3 tracking-[0.07em] uppercase">
                Featured
              </span>
            )}
            <h1 className="text-ivory-blush font-montserrat font-bold text-[clamp(1.4rem,3vw,2rem)] m-0 mb-3 leading-[1.2]">
              {product.productName}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-ivory-blush font-montserrat font-bold text-2xl">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-velvet-rose-mist font-poppins text-base line-through">
                    ₹{product.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
            </div>

            {product.description && (
              <p className="text-velvet-rose-mist font-poppins text-[0.9rem] leading-[1.7] mb-4">
                {product.description}
              </p>
            )}

            {/* Sizing Chart */}
            <div className="mb-6">
              <p className="text-ivory-blush font-inter text-sm font-semibold mb-2.5 tracking-[0.05em] uppercase">
                Sizing Chart
              </p>
              <div className="bg-cocoa-orchid rounded-md overflow-hidden border border-velvet-rose-mist/15">
                <table className="w-full border-collapse font-inter text-sm">
                  <thead>
                    <tr className="bg-royal-plum-veil">
                      <th className="text-ivory-blush font-semibold py-2 px-3.5 text-left tracking-[0.04em]">
                        Size
                      </th>
                      <th className="text-ivory-blush font-semibold py-2 px-3.5 text-left tracking-[0.04em]">
                        Inches
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { size: "S", inches: 36 },
                      { size: "M", inches: 38 },
                      { size: "L", inches: 40 },
                      { size: "XL", inches: 42 },
                      { size: "XXL", inches: 44 },
                      { size: "3XL", inches: 46 },
                      { size: "4XL", inches: 48 },
                      { size: "5XL", inches: 50 },
                    ].map(({ size, inches }, i) => (
                      <tr
                        key={size}
                        className={`border-t border-velvet-rose-mist/10 ${
                          i % 2 === 0 ? "bg-transparent" : "bg-white/5"
                        }`}
                      >
                        <td className="text-ivory-blush py-2 px-3.5 font-semibold">
                          {size}
                        </td>
                        <td className="text-velvet-rose-mist py-2 px-3.5">
                          {inches}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-ivory-blush font-inter text-sm font-semibold mb-2 tracking-[0.05em] uppercase">
                  Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border font-inter text-[0.85rem] cursor-pointer transition-all ${
                        selectedSize === size
                          ? "border-royal-plum-veil bg-royal-plum-veil text-ivory-blush"
                          : "border-velvet-rose-mist/30 bg-transparent text-velvet-rose-mist hover:border-velvet-rose-mist/60"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-ivory-blush font-inter text-sm font-semibold mb-2 tracking-[0.05em] uppercase">
                Quantity
              </p>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 bg-cocoa-orchid text-ivory-blush border border-velvet-rose-mist/30 rounded-l cursor-pointer text-lg hover:bg-cocoa-orchid/80 transition-colors"
                >
                  −
                </button>
                <span className="min-w-[48px] h-9 flex items-center justify-center bg-midnight-truffle text-ivory-blush border-y border-velvet-rose-mist/30 font-montserrat font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 bg-cocoa-orchid text-ivory-blush border border-velvet-rose-mist/30 rounded-r cursor-pointer text-lg hover:bg-cocoa-orchid/80 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={adding || !product.inStock}
                className={`flex-1 min-w-[160px] py-3 px-5 rounded-sm bg-transparent border border-royal-plum-veil font-montserrat font-semibold text-[0.875rem] flex items-center justify-center gap-2 transition-colors ${
                  product.inStock
                    ? "text-ivory-blush cursor-pointer hover:bg-royal-plum-veil/10"
                    : "text-velvet-rose-mist cursor-not-allowed border-velvet-rose-mist/50"
                }`}
              >
                <FiShoppingCart size={16} />{" "}
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
              {product.inStock && (
                <button
                  onClick={() => handleAddToCart(true)}
                  disabled={adding}
                  className="flex-1 min-w-[160px] py-3 px-5 rounded-sm bg-royal-plum-veil text-ivory-blush border border-royal-plum-veil font-montserrat font-semibold text-[0.875rem] cursor-pointer flex items-center justify-center gap-2 hover:bg-royal-plum-veil/80 transition-colors"
                >
                  <FiZap size={16} /> Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default ProductPage;
