import React, { useState } from "react";
import { useCart, useCartDispatch } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const { items } = useCart();
  const dispatch = useCartDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [method, setMethod] = useState("COD");

  const handleOrder = () => {
    dispatch({ type: "CLEAR" });
    navigate("/order-success", { state: { method } });
  };

  return (
    <div className="w-[90%] mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Payment Method</h1>

      <div className="border rounded-xl p-6 bg-white shadow-md space-y-4 max-w-md">

        <label className="flex gap-3 items-center cursor-pointer">
          <input type="radio" checked={method === "COD"} onChange={() => setMethod("COD")} />
          <span>Cash On Delivery</span>
        </label>

        <label className="flex gap-3 items-center cursor-pointer">
          <input type="radio" checked={method === "UPI"} onChange={() => setMethod("UPI")} />
          <span>UPI / Google Pay / PhonePe</span>
        </label>

        <button
          className="w-full mt-4 py-3 bg-green-600 text-white text-lg rounded-xl hover:bg-[#8B623F] transition"
          onClick={handleOrder}
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  );
};

export default Payment;
