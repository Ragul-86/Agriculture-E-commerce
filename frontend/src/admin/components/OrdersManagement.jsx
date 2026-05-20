import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchOrders, updateOrder, deleteOrder as deleteOrderApi } from "../../api/ordersApi";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
      // Fallback to localStorage
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(savedOrders);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await updateOrder(id, { status: newStatus });
      await loadOrders(); // Reload orders
      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order status");
      // Fallback to local update
      const updated = orders.map((o) =>
        (o._id === id || o.id === id) ? { ...o, status: newStatus } : o
      );
      setOrders(updated);
      localStorage.setItem("orders", JSON.stringify(updated));
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrderApi(id);
        await loadOrders(); // Reload orders
        toast.success("Order deleted successfully!");
      } catch (error) {
        console.error("Failed to delete order:", error);
        toast.error("Failed to delete order");
        // Fallback to local update
        const updated = orders.filter((o) => (o._id !== id && o.id !== id));
        setOrders(updated);
        localStorage.setItem("orders", JSON.stringify(updated));
      }
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Packed: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🧾 Orders Management</h2>
        <div className="text-sm text-gray-600">
          Total Orders: <span className="font-bold">{orders.length}</span> | 
          Total Revenue: <span className="font-bold text-green-600">₹{totalRevenue}</span>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded ${
            filterStatus === "all"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </button>
        {["Pending", "Packed", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded ${
                filterStatus === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="bg-white shadow rounded-lg p-8 text-center text-gray-500">
          Loading orders...
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.orderId || order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.userId?.name || order.customerName || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.userId?.email || order.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} item(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{order.totalAmount || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => updateOrderStatus(order._id || order.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded ${
                          statusColors[order.status] || statusColors.Pending
                        } border-0 cursor-pointer`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteOrder(order._id || order.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;

