import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OrderTracking from "../context/OrderTracking";
import { fetchOrders } from "../api/ordersApi";
import toast from "react-hot-toast";

const TrackOrderWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const orders = await fetchOrders();
        const foundOrder = orders.find((o) => 
          String(o.orderId) === String(id) || 
          String(o._id) === String(id) || 
          String(o.id) === String(id)
        );
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          // Fallback to localStorage
          const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
          const localOrder = localOrders.find((o) => String(o.id) === String(id));
          
          if (localOrder) {
            setOrder(localOrder);
          } else {
            // Order not found anywhere
            setOrder(null);
          }
        }
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error("Failed to load order details");
        
        // Fallback to localStorage on error
        const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
        const localOrder = localOrders.find((o) => String(o.id) === String(id));
        setOrder(localOrder || null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="text-gray-500">Loading order details...</div>
      </div>
    );
  }

  // ⚠️ FIX: Prevent crash if order not found
  if (!order) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 text-xl font-semibold mb-4">
          ❌ Order Not Found
        </div>
        <p className="text-gray-600 mb-6">
          Order ID: {id} could not be found in our system.
        </p>
        <button
          onClick={() => navigate("/my-orders")}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  return <OrderTracking order={order} />;
};

export default TrackOrderWrapper;
