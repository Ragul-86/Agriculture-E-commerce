import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchProducts, createProduct, deleteProduct as deleteProductApi, updateProduct } from "../../api/productsApi";
import { uploadImage } from "../../api/uploadApi";

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    oldPrice: "",
    description: "",
    category: "",
    image: "",
    stock: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductApi(id);
        await loadProducts(); // Reload products
        toast.success("Product deleted successfully!");
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const toggleStock = async (id) => {
    const product = products.find((p) => p.id === id || p._id === id);
    if (!product) return;

    try {
      const updatedProduct = {
        ...product,
        stock: product.stock > 0 ? 0 : 10,
        isActive: product.stock > 0 ? false : true
      };
      await updateProduct(id, updatedProduct);
      await loadProducts(); // Reload products
      toast.success(`Product marked as ${updatedProduct.stock > 0 ? "in stock" : "out of stock"}!`);
    } catch (error) {
      console.error("Failed to update product stock:", error);
      toast.error("Failed to update product stock");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.title || !newProduct.price) {
      toast.error("Product name and price are required");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare product data
      const productData = {
        title: newProduct.title,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        description: newProduct.description,
        category: newProduct.category || "Other",
        image: newProduct.image || "/images/default.png",
        stock: Number(newProduct.stock) || 10,
        rating: 4.0,
        isActive: true
      };

      await createProduct(productData);
      await loadProducts(); // Reload products

      // Reset form and close modal
      setNewProduct({
        title: "",
        price: "",
        oldPrice: "",
        description: "",
        category: "",
        image: "",
        stock: 0
      });
      setShowAddModal(false);
      toast.success("Product added successfully!");
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error(error.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Handle image URL for display
  const getImageUrl = (image) => {
    if (!image) return "/images/default.png";
    if (image.startsWith('data:')) return image; // Base64
    if (image.startsWith('http')) return image; // Full URL
    if (image.startsWith('/uploads/')) return `http://localhost:5000${image}`; // Uploaded images
    if (image.startsWith('/images/')) return image; // Static images in public folder
    return `http://localhost:5000${image}`; // Default server path
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        e.target.value = ""; // Clear the input
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        e.target.value = ""; // Clear the input
        return;
      }

      try {
        setLoading(true);
        const uploadResult = await uploadImage(file);
        // Use the uploaded image path
        setNewProduct({ ...newProduct, image: uploadResult.imagePath });
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload image");
        e.target.value = ""; // Clear the input
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    (product.title || product.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📦 Products Management</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total Products: <span className="font-bold">{products.length}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <span>+</span> Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          Loading products...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No products found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id || product._id} className="bg-white shadow rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{product.title || product.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      product.stock > 0 && product.isActive !== false
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 0 && product.isActive !== false ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-lg font-bold text-green-600 mb-3">
                  ₹{product.price}
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₹{product.oldPrice}
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStock(product.id || product._id)}
                    className={`flex-1 px-3 py-2 text-sm rounded ${
                      product.stock > 0 && product.isActive !== false
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {product.stock > 0 && product.isActive !== false ? "Mark Out of Stock" : "Mark In Stock"}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id || product._id)}
                    className="px-3 py-2 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold">Add New Product</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                {/* Product Image */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {newProduct.image && newProduct.image !== "/images/default.png" ? (
                      <div>
                        <img
                          src={getImageUrl(newProduct.image)}
                          alt="Preview"
                          className="max-h-32 mx-auto mb-2 rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image: "/images/default.png" })}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500 mb-2">No image selected</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="text-sm"
                          disabled={loading}
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Recommended: Square image, max 2MB</p>
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    placeholder="Enter product name"
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description"
                    rows="3"
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="Enter initial stock quantity"
                    min="0"
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                {/* Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Regular Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.oldPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, oldPrice: e.target.value })}
                      placeholder="Original price"
                      min="0"
                      step="0.01"
                      className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Sale Price (₹) *</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="Current price"
                      min="0"
                      step="0.01"
                      className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave regular price empty if no discount</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;

