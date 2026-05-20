import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import { loginUser } from "../api/authApi";

const BuyerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({ email: "", password: "" });

  const change = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(data);
      toast.success("Login successful!");

      // Check if redirect param exists
      const redirectUrl = new URLSearchParams(window.location.search).get("redirect");

      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate("/");
      }

      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Invalid email or password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="User Login">
      <form onSubmit={login} className="flex flex-col gap-5">

          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={change}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={change}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              required
              minLength={6}
            />
          </div>

        <p className="-mt-2 text-sm">
          New user?{" "}
          <Link to="/buyer-register" className="text-[#8B623F] font-semibold">
            create account
          </Link>
        </p>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-[#8B623F] text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthCard>
  );
};

export default BuyerLogin;
