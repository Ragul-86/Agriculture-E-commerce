import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { items } = useCart();
  const cartCount = items.reduce((s, it) => s + it.qty, 0);

  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const buyer = JSON.parse(localStorage.getItem("buyer_logged"));
  const admin = JSON.parse(localStorage.getItem("admin_logged"));
 
  const onSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  const logout = () => {
    localStorage.removeItem("buyer_logged");
    localStorage.removeItem("admin_logged");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="w-full bg-white shadow-sm py-3 ">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/">
          <img
            src="/src/assets/logo.png"
            alt="GreenCart Logo"
            className="h-14 w-auto drop-shadow-md"
          />
        </Link>

        {/* Search + Links */}
        <div className="flex items-center gap-8">

          {/* Seller Dashboard Button */}
          {/* {seller && (
            <Link 
              to="/dashboard"
              className="px-5 py-2 rounded-full border border-gray-300 hover:border-green-600 hover:text-green-600 transition-all"
            >
              Seller Dashboard
            </Link>
          )} */}

          <Link to="/" className="hover:text-green-600">Home</Link>

          <Link to="/products" className="hover:text-green-600">
            All Product
          </Link>

          {/* Search Bar */}
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              className="px-3 py-2 rounded-full border border-gray-300 w-64 focus:outline-none focus:border-green-600"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-green-600">
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-green-600 text-xl"
            />
            <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          {/* Login / Logout */}
          {!buyer && !admin ? (
            <div className="flex gap-3">
              <Link
                to="/buyer-login"
                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-[#8B623F]"
              >
                Login
              </Link>

              <Link
                to="/admin-login"
                className="border border-green-600 px-4 py-2 rounded-full text-green-600 hover:bg-[#8B623F] hover:text-white"
              >
                Admin
              </Link>
            </div>
          ) : (
            <>
              {admin && (
                <Link
                  to="/admin-dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  Admin Dashboard
                </Link>
              )}

              <span className="font-semibold text-[#8B623F]">
                {buyer?.name || admin?.name}
              </span>

              <button
                onClick={logout}
                className="px-4 py-2 border border-green-600 text-green-600 rounded-full hover:bg-[#8B623F] hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
