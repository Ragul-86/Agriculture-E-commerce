import React, { useState } from "react";
import toast from "react-hot-toast";
import { useCart, useCartDispatch } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";
import { FiArrowLeft } from "react-icons/fi";
import { createOrder } from "../api/ordersApi";

const CartPage = () => {
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("buyer_logged") || "null");
  const savedAddress = JSON.parse(localStorage.getItem("shipping_address") || "null");

  const [paymentMethod, setPaymentMethod] = useState("");
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    dispatch({ type: "CHANGE_QTY", payload: { id, qty } });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.02;
  const total = subtotal + tax;

  // ---------------------------------------------------------
  // PLACE ORDER (WITHOUT CHECKOUT PAGE)
  // ---------------------------------------------------------
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty! Add items before placing order.");
      return;
    }

    if (!user) {
      navigate("/buyer-login?redirect=/cart");
      return;
    }

    if (!savedAddress) {
      toast.error("Please add a delivery address before placing the order!");
      navigate("/add-address");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items,
        totalAmount: total,
        address: savedAddress,
        paymentMethod,
      };

      await createOrder(orderData);
      
      // Also save to localStorage for backward compatibility
      const order = {
        id: "OD" + Date.now(),
        items,
        totalAmount: total,
        address: savedAddress,
        paymentMethod,
        date: new Date().toLocaleString(),
        status: "Pending",
      };

      const oldOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      oldOrders.push(order);
      localStorage.setItem("orders", JSON.stringify(oldOrders));

      dispatch({ type: "CLEAR_CART" });
      toast.success("Order placed successfully!");
      navigate("/order-success");
    } catch (error) {
      // Show specific error message
      const errorMessage = error.message || 
                          error.response?.data?.error || 
                          error.response?.data?.details ||
                          "Failed to place order. Please check your order details.";
      toast.error(errorMessage);
      console.error("Order creation error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-6 flex gap-10 justify-between">
      
      {/* LEFT SIDE */}
      <div className="flex-1">
        <h2 className="text-3xl font-semibold">
          Shopping Cart{" "}
          <span className="text-green-600">({totalItems} {totalItems === 1 ? "Item" : "Items"})</span>
        </h2>

        <button
          onClick={() => navigate("/")}
          className="flex items-center text-green-600 gap-2 mt-4 hover:underline"
        >
          <FiArrowLeft /> Continue Shopping
        </button>

        <div className="grid grid-cols-3 mt-10 pb-3 text-gray-500 border-b w-[70%]">
          <p>Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {items.length === 0 && (
          <p className="mt-10 text-gray-500">Your cart is empty.</p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-3 items-center py-6 border-b w-[70%]"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 rounded-md object-cover"
              />
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-gray-500">{formatCurrency(item.price)}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => changeQty(item.id, item.qty - 1)}
                    className="px-2 border rounded"
                  >
                    -
                  </button>
                  <span className="font-semibold">{item.qty}</span>
                  <button
                    onClick={() => changeQty(item.id, item.qty + 1)}
                    className="px-2 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center font-semibold">
              {formatCurrency(item.qty * item.price)}
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 font-medium"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — ORDER SUMMARY */}
      <div className="w-[360px] bg-gray-100 p-6 rounded-xl shadow-sm border">

        <h3 className="text-xl font-bold border-b pb-3 mb-4">Order Summary</h3>

        {/* ADDRESS */}
        <p className="text-gray-700 font-semibold mb-1">DELIVERY ADDRESS</p>

        {savedAddress ? (
          <div className="text-gray-600 text-sm leading-6">
            {savedAddress.firstName} {savedAddress.lastName} <br />
            {savedAddress.street}, {savedAddress.city} <br />
            {savedAddress.state} - {savedAddress.zip} <br />
            {savedAddress.country} <br />
            📞 {savedAddress.phone}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No address added</p>
        )}

        <button
          onClick={() => navigate("/add-address")}
          className="text-green-600 text-sm font-semibold mt-1"
        >
          Change
        </button>

        {/* PAYMENT METHOD */}
        <div className="mt-6">
          <p className="text-gray-700 font-semibold mb-2">Payment Method</p>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white"
          >
            <option value="">Select Payment Method</option>
            <option value="COD">Cash On Delivery</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Debit / Credit Card</option>
          </select>
        </div>

        {/* PRICE SUMMARY */}
        <div className="mt-6 border-t pt-4 text-sm text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span>Price</span> <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee</span>{" "}
            <span className="text-green-600">Free</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (2%)</span> <span>{formatCurrency(tax)}</span>
          </div>
        </div>

        <div className="flex justify-between text-lg font-bold mt-4">
          <span>Total Amount:</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {/* PLACE ORDER BUTTON */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
