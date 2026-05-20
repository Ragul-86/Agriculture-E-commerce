import api from "./config";

// Get all users (Admin only)
export const fetchUsers = async () => {
  try {
    const res = await api.get("/users");
    // Backend returns { users: [...], pagination: {...} }
    return res.data.users || res.data || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get single user by ID
export const fetchUserById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// Delete user (Admin only)
export const deleteUser = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

