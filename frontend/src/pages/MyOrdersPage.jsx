import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import { toast } from "sonner";

const MyOrdersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders/my");
        setOrders(res.data.orders);
      } catch {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="bg-midnight-truffle min-h-screen">
        <Navbar />
        <div className="text-center p-16 text-ivory-blush">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-midnight-truffle min-h-screen">
      <Navbar />
      <div className="max-w-[800px] mx-auto py-8 px-6">
        <h1 className="text-ivory-blush font-montserrat font-bold text-[clamp(1.5rem,4vw,2.5rem)] mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-cocoa-orchid rounded-lg p-8 text-center border border-velvet-rose-mist/20">
            <p className="text-velvet-rose-mist font-poppins text-base">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/store")}
              className="mt-4 bg-royal-plum-veil text-ivory-blush border-none rounded px-6 py-2.5 font-montserrat cursor-pointer hover:bg-royal-plum-veil/80 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-cocoa-orchid rounded-lg p-6 border border-velvet-rose-mist/20"
              >
                <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                  <div>
                    <h3 className="text-ivory-blush font-montserrat m-0 mb-2 text-lg">
                      Order #{order.orderId.split("-")[0].toUpperCase()}
                    </h3>
                    <p className="text-velvet-rose-mist font-inter text-[0.85rem] m-0">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-ivory-blush font-montserrat font-bold text-xl m-0 mb-2">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </p>
                    <div className="flex gap-2 justify-end">
                      <span
                        className={`bg-velvet-rose-mist/10 px-2 py-1 rounded text-xs font-inter capitalize border border-velvet-rose-mist/20 ${
                          order.paymentStatus === "paid"
                            ? "text-emerald-300"
                            : "text-amber-300"
                        }`}
                      >
                        {order.paymentMethod === "razorpay"
                          ? "Razorpay"
                          : "COD"}{" "}
                        - {order.paymentStatus}
                      </span>
                      <span className="bg-velvet-rose-mist/10 text-velvet-rose-mist px-2 py-1 rounded text-xs font-inter capitalize border border-velvet-rose-mist/20">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-velvet-rose-mist/10 pt-4">
                  <p className="text-ivory-blush font-inter text-sm mb-2">
                    Items
                  </p>
                  <div className="flex flex-col gap-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-velvet-rose-mist font-poppins text-[0.85rem]"
                      >
                        <span>
                          {item.quantity} x {item.productName} (Size:{" "}
                          {item.size})
                        </span>
                        <span>
                          ₹
                          {(item.priceAtOrder * item.quantity).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
