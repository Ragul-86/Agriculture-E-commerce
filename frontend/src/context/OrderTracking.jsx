import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Order Placed",
  "Packed",
  "Out for Delivery",
  "Delivered"
];

const OrderTracking = ({ order }) => {
  const navigate = useNavigate();

  // Map order status to tracking step
  const getStatusStep = (status) => {
    if (!status) return 0;
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'pending' || statusLower === 'order placed') return 0;
    if (statusLower === 'processing' || statusLower === 'packed') return 1;
    if (statusLower === 'shipped' || statusLower === 'out for delivery') return 2;
    if (statusLower === 'delivered') return 3;
    return 0;
  };

  const currentStep = getStatusStep(order.status);

  if (!order) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-3">Order Not Found</h1>
        <button
          onClick={() => navigate("/my-orders")}
          className="text-green-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">Track Order</h1>

      <p className="text-gray-600 mb-4">
        <b>Order ID:</b> {order.orderId || order.id}
      </p>

      {/* Order Details */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Order Details</h3>
        <div className="space-y-1 text-sm">
          <p><b>Status:</b> <span className="capitalize">{order.status || 'Pending'}</span></p>
          <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
          <p><b>Payment Method:</b> {order.paymentMethod}</p>
          <p><b>Order Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      {/* ETA */}
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
        <p className="text-green-700 font-semibold">Estimated Delivery</p>
        <p className="text-gray-700">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Tracking Steps */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white 
              ${index <= currentStep ? "bg-green-600" : "bg-gray-300"}`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>

            <p
              className={`text-lg ${
                index <= currentStep ? "text-green-700 font-semibold" : "text-gray-600"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>

      {/* Reorder Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
      >
        Reorder Items
      </button>
    </div>
  );
};

export default OrderTracking;
