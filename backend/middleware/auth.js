import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        error: "Not authorized. No token provided.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          error: "User not found.",
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          error: "User account is deactivated.",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        error: "Not authorized. Invalid token.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Server error during authentication.",
    });
  }
};

// Admin only routes
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      error: "Access denied. Admin privileges required.",
    });
  }
};

// Generate JWT token
export const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: "7d",
  });
};

