import React from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import { useCart } from "../context/CartContext.jsx";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const imgUrl = (img) =>
  img?.startsWith("http") ? img : `${VITE_API_URL}${img}`;

const CartPage = () => {
  const { cartItems, cartCount, updateQty, removeItem } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  const handleRemove = async (cartItemId) => {
    try {
      await removeItem(cartItemId);
      toast.success("Item removed");
    } catch {
      toast.error("Could not remove item");
    }
  };

  const handleUpdateQty = async (cartItemId, qty) => {
    if (qty < 1) return;
    try {
      await updateQty(cartItemId, qty);
    } catch {
      toast.error("Could not update quantity");
    }
  };

  return (
    <div className="bg-midnight-truffle min-h-screen">
      <Navbar />
      <div className="max-w-[900px] mx-auto px-4 py-8 sm:px-6 w-full">
        <Link
          to="/store"
          className="inline-flex items-center gap-1.5 text-velvet-rose-mist font-inter text-[0.85rem] no-underline mb-6 hover:text-velvet-rose-mist/80 transition-colors"
        >
          <FiArrowLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="text-ivory-blush font-montserrat font-bold text-[clamp(1.4rem,4vw,2rem)] m-0 mb-6">
          Your Cart{" "}
          {cartCount > 0 && (
            <span className="text-velvet-rose-mist text-base font-normal">
              ({cartCount} item{cartCount !== 1 ? "s" : ""})
            </span>
          )}
        </h1>

        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FiShoppingBag
              size={56}
              className="text-royal-plum-veil mx-auto mb-4"
            />
            <p className="text-velvet-rose-mist font-poppins text-base mb-6">
              Your cart is empty.
            </p>
            <Link
              to="/store"
              className="bg-royal-plum-veil text-ivory-blush px-6 py-2.5 rounded-sm font-montserrat font-semibold no-underline text-sm hover:bg-royal-plum-veil/90 transition-colors"
            >
              Browse Collection
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] gap-8 items-start w-full">
            {/* Items */}
            <div className="flex flex-col gap-4 w-full">
              {cartItems.map((item) => {
                const product = item.productId;
                const imgSrc = product?.images?.[0]
                  ? imgUrl(product.images[0])
                  : null;
                return (
                  <motion.div
                    key={item.cartItemId}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="flex flex-row gap-3 sm:gap-4 items-center w-full bg-cocoa-orchid rounded-lg p-4 border border-velvet-rose-mist/15"
                  >
                    {/* Image */}
                    <div className="w-[72px] h-[96px] bg-midnight-truffle rounded overflow-hidden shrink-0">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product?.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory-blush font-montserrat font-semibold text-[0.9rem] m-0 mb-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {product?.productName || "Product"}
                      </p>
                      <p className="text-velvet-rose-mist font-inter text-sm m-0 mb-2">
                        Size: {item.size}
                      </p>
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() =>
                            handleUpdateQty(item.cartItemId, item.quantity - 1)
                          }
                          className="w-7 h-7 bg-midnight-truffle text-ivory-blush border border-velvet-rose-mist/30 rounded-l cursor-pointer text-base flex items-center justify-center hover:bg-midnight-truffle/80 transition-colors"
                        >
                          −
                        </button>
                        <span className="min-w-[36px] h-7 flex items-center justify-center bg-midnight-truffle text-ivory-blush border-y border-velvet-rose-mist/30 font-montserrat text-[0.85rem] font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQty(item.cartItemId, item.quantity + 1)
                          }
                          className="w-7 h-7 bg-midnight-truffle text-ivory-blush border border-velvet-rose-mist/30 rounded-r cursor-pointer text-base flex items-center justify-center hover:bg-midnight-truffle/80 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price + remove */}
                    <div className="text-right shrink-0">
                      <p className="text-ivory-blush font-montserrat font-bold text-[0.95rem] m-0 mb-2">
                        ₹
                        {((product?.price || 0) * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                      <button
                        onClick={() => handleRemove(item.cartItemId)}
                        className="bg-transparent border-none text-velvet-rose-mist cursor-pointer p-1 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="w-full md:min-w-[220px] lg:min-w-[280px] md:sticky top-[80px] bg-cocoa-orchid rounded-lg p-6 border border-velvet-rose-mist/20">
              <h2 className="text-ivory-blush font-montserrat font-semibold text-base m-0 mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-velvet-rose-mist font-poppins text-[0.875rem]">
                  Subtotal
                </span>
                <span className="text-ivory-blush font-montserrat font-semibold text-[0.875rem]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="border-t border-velvet-rose-mist/20 my-3" />
              <div className="flex justify-between mb-4">
                <span className="text-ivory-blush font-montserrat font-bold text-[0.95rem]">
                  Total
                </span>
                <span className="text-ivory-blush font-montserrat font-bold text-[0.95rem]">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-royal-plum-veil text-ivory-blush border-none rounded-sm p-2.5 font-montserrat font-semibold text-[0.875rem] cursor-pointer hover:bg-royal-plum-veil/90 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
