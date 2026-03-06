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
      <div className="bg-midnight-truffle min-h-screen">
        <Navbar />
        <div className="text-center p-16 text-ivory-blush">Loading...</div>
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="bg-midnight-truffle min-h-screen">
        <Navbar />
        <div className="text-center p-16">
          <h2 className="text-ivory-blush font-montserrat font-bold text-2xl mb-4">
            Order Not Found
          </h2>
          <Link
            to="/store"
            className="text-velvet-rose-mist no-underline font-inter hover:text-ivory-blush transition-colors"
          >
            ← Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-midnight-truffle min-h-screen">
      <Navbar />
      <div className="max-w-[600px] w-full mx-auto my-8 sm:my-12 p-6 sm:p-8 text-center bg-cocoa-orchid rounded-lg border border-velvet-rose-mist/20">
        <div className="w-[60px] h-[60px] rounded-full bg-royal-plum-veil flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🎉</span>
        </div>

        <h1 className="text-ivory-blush font-montserrat font-bold text-3xl mb-4">
          Thank you for your order!
        </h1>

        <p className="text-velvet-rose-mist font-poppins text-base mb-8">
          We've received your order and are processing it.
        </p>

        <div className="bg-royal-plum-veil/15 rounded-md p-6 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-velvet-rose-mist font-inter text-sm">
              Order ID
            </span>
            <span className="text-ivory-blush font-inter font-semibold">
              #{order.orderId.substring(0, 8)}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-velvet-rose-mist font-inter text-sm">
              Payment Method
            </span>
            <span className="text-ivory-blush font-inter font-semibold capitalize">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-velvet-rose-mist font-inter text-sm">
              Payment Status
            </span>
            <span
              className={`font-inter font-semibold capitalize ${
                order.paymentStatus === "paid"
                  ? "text-emerald-300"
                  : "text-amber-300"
              }`}
            >
              {order.paymentStatus}
            </span>
          </div>
          <div className="border-t border-velvet-rose-mist/20 my-4" />
          <div className="flex justify-between">
            <span className="text-ivory-blush font-montserrat font-bold">
              Total Amount
            </span>
            <span className="text-ivory-blush font-montserrat font-bold">
              ₹{order.amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          <Link
            to="/my-orders"
            className="flex-1 bg-cocoa-orchid text-ivory-blush border border-velvet-rose-mist/30 rounded p-3 font-montserrat font-semibold no-underline transition-colors hover:bg-cocoa-orchid/80"
          >
            View My Orders
          </Link>
          <Link
            to="/store"
            className="flex-1 bg-royal-plum-veil text-ivory-blush border-none rounded p-3 font-montserrat font-semibold no-underline transition-colors hover:bg-royal-plum-veil/80"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
