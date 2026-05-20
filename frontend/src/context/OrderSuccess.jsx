import React from "react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  const order = JSON.parse(localStorage.getItem("last_order"));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md max-w-lg text-center">

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl">
            ✓
          </div>
        </div>

        <h1 className="text-3xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-3">
          Thank you for shopping with <b>Farm2Home</b>.
        </p>

        {/* ORDER DETAILS */}
        {order && (
          <div className="bg-gray-100 mt-6 p-5 rounded-lg text-left space-y-2">
            <p>
              <b>Order ID:</b> {order.id}
            </p>
            <p>
              <b>Total Amount:</b> ₹{order.totalAmount}
            </p>
            <p>
              <b>Payment Method:</b> {order.paymentMethod}
            </p>
            <p>
              <b>Placed On:</b> {order.date}
            </p>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 mt-8">
          <Link
            to="/my-orders"
            className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="border border-green-600 text-green-600 py-3 rounded-lg hover:bg-green-50 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
