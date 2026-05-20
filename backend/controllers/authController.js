import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        error: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: "buyer",
    });

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      message: "User registered successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: error.message || "Failed to register user",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Check user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email, user.role);

    res.json({
      message: "Login successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: error.message || "Failed to login",
    });
  }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Default admin credentials
    const adminEmail = "admin@agriculture.com";
    const adminPassword = "admin123";

    if (email === adminEmail && password === adminPassword) {
      // Check if admin user exists in database, if not create it
      let adminUser = await User.findOne({ email: adminEmail });

      if (!adminUser) {
        adminUser = await User.create({
          name: "Admin",
          email: adminEmail,
          password: adminPassword,
          role: "admin",
        });
      } else if (adminUser.role !== "admin") {
        // Update to admin if not already
        adminUser.role = "admin";
        await adminUser.save();
      }

      const token = generateToken(adminUser._id, adminUser.email, adminUser.role);

      res.json({
        message: "Admin login successful",
        user: adminUser.toJSON(),
        token,
      });
    } else {
      res.status(401).json({
        error: "Invalid admin credentials",
      });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      error: error.message || "Failed to login",
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.toJSON());
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      error: error.message || "Failed to get user",
    });
  }
};

