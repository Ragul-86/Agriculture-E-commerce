import React, { useState, useEffect } from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const savedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    const savedBuyers = JSON.parse(localStorage.getItem("buyers") || "[]");
    setOrders(savedOrders);
    setProducts(savedProducts);
    setBuyers(savedBuyers);
  }, []);

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = buyers.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Status distribution
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Daily revenue (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const dailyRevenue = last7Days.map((dayLabel, idx) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - (6 - idx));
    const targetDateStr = targetDate.toDateString();
    
    return orders
      .filter((o) => {
        if (o.date) {
          return new Date(o.date).toDateString() === targetDateStr;
        }
        // If no date, use order ID as timestamp (fallback)
        if (o.id && typeof o.id === 'number') {
          const orderDate = new Date(o.id);
          return orderDate.toDateString() === targetDateStr;
        }
        return false;
      })
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  });

  // Category distribution
  const categoryCounts = products.reduce((acc, product) => {
    const category = product.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const revenueChartData = {
    labels: last7Days,
    datasets: [
      {
        label: "Revenue (₹)",
        data: dailyRevenue,
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Orders",
        data: Object.values(statusCounts),
        backgroundColor: [
          "rgba(234, 179, 8, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        label: "Products",
        data: Object.values(categoryCounts),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📊 Analytics Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-green-600">₹{totalRevenue}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <h3 className="text-2xl font-bold text-blue-600">{totalOrders}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <h3 className="text-2xl font-bold text-purple-600">{totalProducts}</h3>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-orange-600">{totalUsers}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Average Order Value</h3>
          <p className="text-3xl font-bold text-green-600">₹{avgOrderValue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Products in Stock</h3>
          <p className="text-3xl font-bold text-blue-600">
            {products.filter((p) => p.stock).length} / {totalProducts}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 7 Days)</h3>
          <Line data={revenueChartData} options={{ responsive: true }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <Doughnut data={statusChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Products by Category</h3>
        <Bar data={categoryChartData} options={{ responsive: true }} />
      </div>
    </div>
  );
};

export default Analytics;

