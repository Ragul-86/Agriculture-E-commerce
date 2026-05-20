import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthCard from "../components/AuthCard";
import { registerUser } from "../api/authApi";

const BuyerRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Handle input changes
  const change = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });

    // Reset errors while typing
    if (e.target.name === "email") setErrors({ ...errors, email: "" });
    if (e.target.name === "password") setErrors({ ...errors, password: "" });
  };

  // Register function
  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password } = data;

    // Check all fields
    if (!name || !email || !password) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      setLoading(false);
      return;
    }

    // Password validation: at least 6 chars
    if (password.length < 6) {
      setErrors({
        ...errors,
        password: "Password must be at least 6 characters",
      });
      setLoading(false);
      return;
    }

    try {
      await registerUser({ name, email, password });
      toast.success("Account created successfully!");
      
      // Navigate to home page
      navigate("/");
      window.location.reload();
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      if (errorMessage.includes("already exists")) {
        setErrors({ ...errors, email: errorMessage });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="User SignUp">
      <form onSubmit={register} className="flex flex-col gap-5">
        <div>
          <label className="font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={change}
            placeholder="Enter your full name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            required
          />
        </div>

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
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
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
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <p className="-mt-2 text-sm">
          Already have an account?{" "}
          <Link to="/buyer-login" className="text-[#8B623F] font-semibold">
            click here
          </Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-[#8B623F] text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </AuthCard>
  );
};

export default BuyerRegister;
