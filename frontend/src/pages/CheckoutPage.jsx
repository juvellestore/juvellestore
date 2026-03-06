import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/axios.js";

// Tailwind classes for input fields
const inputCls =
  "w-full bg-cocoa-orchid border border-velvet-rose-mist/30 text-ivory-blush rounded-md px-3.5 py-2.5 font-poppins text-[0.875rem] outline-none focus:border-velvet-rose-mist/60 transition-colors box-border";

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
        description: `Order ${data.razorpayOrderId}`,
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
    <div className="bg-midnight-truffle min-h-screen">
      <Navbar />
      <div className="max-w-[900px] mx-auto px-4 py-8 sm:px-6 w-full">
        <h1 className="text-ivory-blush font-montserrat font-bold text-[clamp(1.4rem,4vw,2rem)] m-0 mb-8">
          Checkout
        </h1>

        <div className="flex flex-col md:grid md:grid-cols-[1fr_340px] gap-8 items-start w-full">
          {/* Main Content Area */}
          <form onSubmit={handleSubmit}>
            <div className="bg-cocoa-orchid rounded-lg p-6 border border-velvet-rose-mist/20 mb-6">
              <h2 className="text-ivory-blush font-montserrat font-semibold text-base m-0 mb-5">
                Shipping Details
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                    Full Name *
                  </label>
                  <input
                    className={inputCls}
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                    Email
                  </label>
                  <input
                    className={`${inputCls} opacity-60 cursor-not-allowed`}
                    value={form.email}
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                    Phone Number *
                  </label>
                  <input
                    className={inputCls}
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-velvet-rose-mist font-inter text-xs tracking-wider uppercase block mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    className={`${inputCls} min-h-[80px] resize-y`}
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-cocoa-orchid rounded-lg p-6 border border-velvet-rose-mist/20 mb-6">
              <h2 className="text-ivory-blush font-montserrat font-semibold text-base m-0 mb-5">
                Payment Method
              </h2>
              <div className="flex flex-col gap-4">
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                    paymentMethod === "razorpay"
                      ? "border-velvet-rose-mist bg-velvet-rose-mist/5"
                      : "border-velvet-rose-mist/20 bg-transparent hover:border-velvet-rose-mist/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="accent-velvet-rose-mist w-4.5 h-4.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-ivory-blush font-montserrat font-semibold block">
                      Pay Online (Razorpay)
                    </span>
                    <span className="text-velvet-rose-mist font-poppins text-xs">
                      Cards, UPI, NetBanking, Wallets
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                    paymentMethod === "cod"
                      ? "border-velvet-rose-mist bg-velvet-rose-mist/5"
                      : "border-velvet-rose-mist/20 bg-transparent hover:border-velvet-rose-mist/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-velvet-rose-mist w-4.5 h-4.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-ivory-blush font-montserrat font-semibold block">
                      Cash on Delivery
                    </span>
                    <span className="text-velvet-rose-mist font-poppins text-xs">
                      Pay when you receive the order
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-sm p-4 font-montserrat font-bold text-base transition-colors duration-200 border-none outline-none ${
                loading
                  ? "bg-cocoa-orchid text-velvet-rose-mist cursor-not-allowed"
                  : "bg-royal-plum-veil text-ivory-blush hover:bg-royal-plum-veil/80 cursor-pointer"
              }`}
            >
              {loading
                ? "Processing…"
                : paymentMethod === "razorpay"
                  ? "Proceed to Payment"
                  : "Place Order (COD)"}
            </button>
          </form>

          {/* Order summary */}
          <div className="w-full md:sticky top-[80px] bg-cocoa-orchid rounded-lg p-6 border border-velvet-rose-mist/20">
            <h2 className="text-ivory-blush font-montserrat font-semibold text-base m-0 mb-4">
              Order Summary
            </h2>
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="flex justify-between items-center mb-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-ivory-blush font-poppins text-xs m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.productId?.productName} × {item.quantity}
                  </p>
                  <p className="text-velvet-rose-mist font-inter text-[0.7rem] m-0">
                    Size: {item.size}
                  </p>
                </div>
                <span className="text-ivory-blush font-montserrat font-semibold text-sm shrink-0 ml-3">
                  ₹
                  {(
                    (item.productId?.price || 0) * item.quantity
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div className="border-t border-velvet-rose-mist/20 my-3" />
            <div className="flex justify-between">
              <span className="text-ivory-blush font-montserrat font-bold">
                Total
              </span>
              <span className="text-ivory-blush font-montserrat font-bold">
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
