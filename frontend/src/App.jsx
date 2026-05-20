import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import BuyerLogin from "./pages/BuyerLogin";
import BuyerRegister from "./pages/BuyerRegister";
import OrderSuccessPage from "./context/OrderSuccess";
import MyOrders from "./context/MyOrder";
import AdminLogin from "./admin/components/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";  // ✅ NEW ADMIN PANEL
import AddressPage from "./context/AddressPage";
import TrackOrderWrapper from "./pages/TrackOrderWrapper";

import "./index.css";

function App() {
  const location = useLocation();

  // Hide navbar on admin dashboard & login pages
  const hideNavbarRoutes = [
    "/admin-login",
    "/admin-dashboard"
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <main style={{ paddingTop: 20 }}>
        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/buyer-register" element={<BuyerRegister />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/add-address" element={<AddressPage />} />
          <Route path="/track-order/:id" element={<TrackOrderWrapper />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
