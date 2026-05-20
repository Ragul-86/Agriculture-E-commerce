import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/productsApi";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";

const Home = () => {
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    fetchProducts()
      .then((data) => mounted && setProducts(data))
      .catch(() => setProducts([]));

    return () => (mounted = false);
  }, []);

  return (
    <div>

      {/* HERO SECTION */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 rounded-2xl overflow-hidden bg-[#DFF7EC] bg-[url('/src/assets/main.png')] bg-cover bg-repeat bg-center min-h-[400px] sm:min-h-[500px] flex items-center"
      >
        <div className="flex-1 py-10 sm:py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-left px-4 sm:px-8 lg:px-15">
            Freshness You Can Trust, <br />
            <span className="text-[#8B623F]">Savings You'll Love!</span>
          </h1>

          <p className="text-gray-700 text-left px-4 sm:px-8 lg:px-15 mt-4 text-lg sm:text-xl">
            Get fresh groceries delivered straight to your home.
          </p>

          <button
            className="mt-5 ml-4 sm:ml-8 lg:ml-15 px-6 py-2 bg-green-600 text-white rounded-md shadow hover:bg-[#8B623F] transition"
            onClick={() => navigate('/products')}
          >
            Shop now
          </button>
        </div>
      </section>

      {/* BEST SELLERS */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-[#8B623F]">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 px-4 sm:px-8 lg:px-25">Best Sellers</h2>

        {!products || !Array.isArray(products) ? (
          <Loading />
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products available. Please seed the database.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {products.slice(0, 5).map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* WHY WE ARE THE BEST SECTION */}
      <section className="mt-20 w-[90%] mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#8B623F] mb-6">
          Why We Are The Best?
        </h2>
        <p className="text-gray-600 max-w-[600px] mx-auto">
          We're committed to quality, freshness, and customer satisfaction. Here's what makes us stand out.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-10">
          
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-5xl">🥦</span>
            <h3 className="font-semibold text-xl mt-3">Fresh & Organic</h3>
            <p className="text-gray-600 mt-2">We source farm-fresh produce directly from trusted suppliers.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-5xl">⚡</span>
            <h3 className="font-semibold text-xl mt-3">Fast Delivery</h3>
            <p className="text-gray-600 mt-2">Your order delivered at lightning speed — fresh and perfect.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-5xl">💰</span>
            <h3 className="font-semibold text-xl mt-3">Affordable Pricing</h3>
            <p className="text-gray-600 mt-2">Quality that doesn't sacrifice your budget.</p>
          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-[#eaf9f0] text-black mt-20 py-10">
        <div className="w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">

         <div>
  <img 
    src="/src/assets/logo.png" 
    alt="GreenCart Logo" 
    className="w-28 mb-3"
  />
  <p>We deliver fresh groceries and snacks straight to your door. Trusted by thousands, we aim to make your shopping experience simple and affordable.</p>
</div>

          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-green-600 transition">Home</Link></li>
              <li><Link to="/products" className="hover:text-green-600 transition">Products</Link></li>
              <li><Link to="/cart" className="hover:text-green-600 transition">Cart</Link></li>
              <li><Link to="/my-orders" className="hover:text-green-600 transition">My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Contact</h3>
            <p>📍 Coimbatore, India</p>
            <p>📞 +91 9385906163</p>
            <p>📧 support@farm2home.com</p>
          </div>

        </div>

        <div className="text-center mt-10 text-sm border-t border-gray-500 pt-4">
          © {new Date().getFullYear()} Farm2Home. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
