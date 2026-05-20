import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersManagement from "./components/UsersManagement";
import ProductsManagement from "./components/ProductsManagement";
import OrdersManagement from "./components/OrdersManagement";
import Analytics from "./components/Analytics";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("analytics");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const admin = JSON.parse(localStorage.getItem("admin_logged"));
    if (!admin) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("admin_logged");
    window.location.href = "/";
  };

  const admin = JSON.parse(localStorage.getItem("admin_logged") || "{}");

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 border-r p-6 bg-white shadow-sm">
        <div className="mb-6">
          <img src="/src/assets/logo.png" className="h-12 mb-2 mx-auto" alt="Logo" />
          <p className="text-center text-sm text-gray-600">Admin Panel</p>
        </div>

        {/* <div className="mb-6 p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-700">{admin.name || "Admin"}</p>
          <p className="text-xs text-gray-500">{admin.email}</p>
        </div> */}

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActivePage("analytics")}
            className={`p-3 rounded text-left flex items-center gap-2 ${
              activePage === "analytics"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            📊 Analytics
          </button>

          <button
            onClick={() => setActivePage("users")}
            className={`p-3 rounded text-left flex items-center gap-2 ${
              activePage === "users"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            👥 Users
          </button>

          <button
            onClick={() => setActivePage("products")}
            className={`p-3 rounded text-left flex items-center gap-2 ${
              activePage === "products"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            📦 Products
          </button>

          <button
            onClick={() => setActivePage("orders")}
            className={`p-3 rounded text-left flex items-center gap-2 ${
              activePage === "orders"
                ? "bg-green-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            🧾 Orders
          </button>
        </nav>

        <button
          onClick={logout}
          className="mt-10 p-3 w-full border border-red-300 rounded text-red-600 hover:bg-red-50 transition"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        {activePage === "analytics" && <Analytics />}
        {activePage === "users" && <UsersManagement />}
        {activePage === "products" && <ProductsManagement />}
        {activePage === "orders" && <OrdersManagement />}
      </main>
    </div>
  );
};

export default AdminDashboard;

