import api from "./config";

// Fetch all products from backend
export const fetchProducts = async () => {
  try {
    const res = await api.get("/products");
    // Backend returns { products: [...], pagination: {...} }
    return res.data.products || res.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to local JSON if backend fails
    try {
      const fallbackRes = await fetch("/products.json");
      const fallbackData = await fallbackRes.json();
      return fallbackData;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      return [];
    }
  }
};

// Fetch single product by ID
export const fetchProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Create new product (admin only)
export const createProduct = async (productData) => {
  try {
    const res = await api.post("/products", productData);
    return res.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete product (admin only)
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
