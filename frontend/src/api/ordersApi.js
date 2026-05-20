import api from "./config";

// Get all orders (or user's orders if userId provided)
export const fetchOrders = async (userId = null) => {
  try {
    const url = userId ? `/orders?userId=${userId}` : "/orders";
    const res = await api.get(url);
    // Backend returns { orders: [...], pagination: {...} }
    return res.data.orders || res.data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get single order by ID
export const fetchOrderById = async (id) => {
  try {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Create new order
export const createOrder = async (orderData) => {
  try {
    const res = await api.post("/orders", orderData);
    return res.data;
  } catch (error) {
    console.error("Error creating order:", error);
    
    // Extract error message from response
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.details ||
                        error.message || 
                        "Failed to create order";
    
    // Create a new error with the message
    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = error.response?.status;
    throw customError;
  }
};

// Update order status (Admin only)
export const updateOrder = async (id, orderData) => {
  try {
    const res = await api.put(`/orders/${id}`, orderData);
    return res.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Delete order (Admin only)
export const deleteOrder = async (id) => {
  try {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

