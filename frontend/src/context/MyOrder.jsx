import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders, updateOrder } from "../api/ordersApi";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("buyer_logged") || "null");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      if (user) {
        // Try to fetch from backend (no userId needed, backend uses token)
        const backendOrders = await fetchOrders();
        setOrders(backendOrders);
      } else {
        // Fallback to localStorage
        const saved = JSON.parse(localStorage.getItem("orders")) || [];
        setOrders(saved);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(saved);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      // Try to update in backend (use _id if available, otherwise id)
      const orderId = orders.find(o => o._id === id || o.id === id)?._id || id;
      await updateOrder(orderId, { status: "Cancelled" });
      
      // Reload orders from backend
      await loadOrders();
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Error cancelling order:", error);
      // Fallback to local update
      const updated = orders.map((o) =>
        (o._id === id || o.id === id) ? { ...o, status: "Cancelled" } : o
      );
      setOrders(updated);
      localStorage.setItem("orders", JSON.stringify(updated));
      toast.success("Order cancelled");
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status?.toLowerCase() === filter);

  if (loading) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-5">My Orders</h1>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-5">My Orders</h1>

      <div className="flex gap-3 mb-6">
        {["all", "delivered", "pending", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded-full border text-sm capitalize ${
              filter === f
                ? "bg-green-600 text-white border-green-600"
                : "border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-gray-500 text-lg">No orders found.</p>
      )}

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id || order.id || order.orderId}
            className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-500 text-sm">
                <b>Order ID:</b> {order.orderId || order.id}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-5">

              {/* PRODUCTS */}
              <div className="col-span-2 space-y-4">
                {order.items?.map((item, i) => (
                  <div key={item.id || item._id || `item-${i}-${item.title}`} className="flex gap-4">
                    <img
                      src={item.image}
                      className="w-20 h-20 rounded-lg border object-cover"
                    />

                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                      <p className="text-green-600 font-bold">
                        ₹{item.qty * item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADDRESS */}
              <div className="text-sm text-gray-700 leading-6">
                <p className="font-bold text-gray-900 mb-1">
                  Delivery Address
                </p>

                {typeof order.address === "object" ? (
                  <>
                    <p>{order.address.firstName} {order.address.lastName}</p>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}</p>
                    <p>{order.address.zip}, {order.address.country}</p>
                    <p>📞 {order.address.phone}</p>
                  </>
                ) : (
                  <p>{order.address}</p>
                )}
              </div>

              {/* SUMMARY */}
              <div className="text-right">
                <p className="font-bold text-xl text-gray-800">
                  ₹{order.totalAmount}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  <b>Payment:</b> {order.paymentMethod}
                </p>
                <p className="text-sm text-gray-600">
                  <b>Date:</b> {order.date}
                </p>

                {/* Cancel Order */}
                {order.status !== "Cancelled" &&
                  order.status !== "Delivered" && (
                    <button
                      onClick={() => handleCancel(order._id || order.id)}
                      className="mt-4 border border-red-500 text-red-500 px-4 py-1 rounded-full text-sm hover:bg-red-50"
                    >
                      Cancel Order
                    </button>
                  )}

                {/* Track Order */}
                <button
                  onClick={() => navigate(`/track-order/${order.orderId || order.id}`)}
                  className="block mt-3 text-green-600 font-semibold text-sm"
                >
                  Track Order →
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
