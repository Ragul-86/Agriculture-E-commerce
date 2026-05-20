import React, { useState } from "react";
import toast from "react-hot-toast";

const AddressPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: ""
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveAddress = () => {
    localStorage.setItem("shipping_address", JSON.stringify(form));
    toast.success("Address saved & updated in cart!");
    window.location.href = "/cart";
  };

  return (
    <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 py-16 px-8">
      
      <div>
        <h1 className="text-4xl font-bold mb-10">
          Add Shipping <span className="text-green-600">Address</span>
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" onChange={change} placeholder="First Name" className="border p-3 rounded" />
          <input name="lastName"  onChange={change} placeholder="Last Name"  className="border p-3 rounded" />
        </div>

        <input name="email"  onChange={change} placeholder="Email address" className="border p-3 w-full rounded mt-4" />
        <input name="street" onChange={change} placeholder="Street"        className="border p-3 w-full rounded mt-4" />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input name="city"    onChange={change} placeholder="City"    className="border p-3 rounded" />
          <input name="state"   onChange={change} placeholder="State"   className="border p-3 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <input name="zip"     onChange={change} placeholder="Zip code" className="border p-3 rounded" />
          <input name="country" onChange={change} placeholder="Country"  className="border p-3 rounded" />
        </div>

        <input name="phone" onChange={change} placeholder="Phone" className="border p-3 w-full rounded mt-4" />

        <button
          onClick={saveAddress}
          className="bg-green-600 text-white mt-8 py-3 rounded w-full md:w-[70%] font-semibold hover:bg-green-700"
        >
          SAVE ADDRESS
        </button>
      </div>

      <div className="flex justify-center mt-10 md:mt-0">
        <img 
          src="./address.png"
          alt="address-svg"
          className="w-[420px]"
        />
      </div>

    </div>
  );
};

export default AddressPage;
