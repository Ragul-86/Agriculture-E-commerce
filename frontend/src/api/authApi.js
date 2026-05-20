import api from "./config";

// Register new user
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/auth/register", userData);
    // Store token and user data
    if (res.data.token) {
      localStorage.setItem("buyer_token", res.data.token);
      localStorage.setItem("buyer_logged", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const res = await api.post("/auth/login", credentials);
    // Store token and user data
    if (res.data.token) {
      localStorage.setItem("buyer_token", res.data.token);
      localStorage.setItem("buyer_logged", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Admin login
export const adminLogin = async (credentials) => {
  try {
    const res = await api.post("/auth/admin/login", credentials);
    // Store token and admin data
    if (res.data.token) {
      localStorage.setItem("admin_token", res.data.token);
      localStorage.setItem("admin_logged", JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

// Logout (client-side only)
export const logout = () => {
  localStorage.removeItem("buyer_token");
  localStorage.removeItem("admin_token");
  localStorage.removeItem("buyer_logged");
  localStorage.removeItem("admin_logged");
};

