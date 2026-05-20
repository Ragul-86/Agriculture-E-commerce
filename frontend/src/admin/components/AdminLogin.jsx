import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminLogin } from "../../api/authApi";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(data);
      toast.success("Admin login successful!");
      navigate("/admin-dashboard");
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid email or password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-[380px] bg-white shadow-xl px-10 py-12 rounded-2xl">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">
            <span className="text-green-600">Admin</span> Login
          </h2>
          <p className="text-sm text-gray-500 mt-2">Access admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">

          {/* Email */}
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="admin@agriculture.com"
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border px-4 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Default: admin@agriculture.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

