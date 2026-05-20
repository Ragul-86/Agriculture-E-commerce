import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ProductsPage = () => {
  const [products, setProducts] = useState(null);
  const q = useQuery().get("q") || "";

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const apiProducts = await fetchProducts();
      const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
      
      // Convert local products to match API format
      const formattedLocalProducts = localProducts.map(p => {
        let imageUrl = "/images/default.png";
        
        // Handle different image formats
        if (p.image) {
          imageUrl = p.image; // Base64 or URL string
        } else if (p.images && p.images.length > 0) {
          if (typeof p.images[0] === 'string') {
            imageUrl = p.images[0]; // URL string
          } else if (p.images[0] instanceof File) {
            imageUrl = URL.createObjectURL(p.images[0]); // File object
          }
        }
        
        return {
          id: p.id || `local_${Date.now()}_${Math.random()}`,
          title: p.name || p.title,
          category: p.category || "Uncategorized",
          price: Number(p.price) || 0,
          oldPrice: p.offerPrice ? Number(p.offerPrice) : (Number(p.price) || 0),
          image: imageUrl,
          rating: 4.0
        };
      });

      // Merge and deduplicate products
      const allProducts = [...apiProducts, ...formattedLocalProducts];
      setProducts(allProducts);
    } catch (error) {
      const localProducts = JSON.parse(localStorage.getItem("products") || "[]");
      const formattedLocalProducts = localProducts.map(p => {
        let imageUrl = "/images/default.png";
        
        if (p.image) {
          imageUrl = p.image;
        } else if (p.images && p.images.length > 0) {
          if (typeof p.images[0] === 'string') {
            imageUrl = p.images[0];
          } else if (p.images[0] instanceof File) {
            imageUrl = URL.createObjectURL(p.images[0]);
          }
        }
        
        return {
          id: p.id || `local_${Date.now()}_${Math.random()}`,
          title: p.name || p.title,
          category: p.category || "Uncategorized",
          price: Number(p.price) || 0,
          oldPrice: p.offerPrice ? Number(p.offerPrice) : (Number(p.price) || 0),
          image: imageUrl,
          rating: 4.0
        };
      });
      setProducts(formattedLocalProducts);
    }
  };

  const filtered = (products || []).filter((p) =>
    (p.title || p.name || "").toLowerCase().includes(q.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          All Products {q ? <span className="text-green-600">— search: "{q}"</span> : ""}
        </h2>
      </div>

      {!products ? (
        <Loading />
      ) : (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">
              {q ? `No products found for "${q}"` : "No products available. Please seed the database."}
            </p>
          ) : (
            filtered.map((p) => (
              <ProductCard product={p} key={p.id || p._id} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
