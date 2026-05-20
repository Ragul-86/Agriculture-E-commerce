import React from "react";
import { formatCurrency } from "../utils/currency";
import { useCartDispatch } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const dispatch = useCartDispatch();

  const addToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id || product._id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
    });

    toast.success(`${product.title} added to cart!`);
  };

  // Handle image URL
  const getImageUrl = (image) => {
    if (!image) return "/images/default.png";
    if (image.startsWith('data:')) return image; // Base64
    if (image.startsWith('http')) return image; // Full URL
    if (image.startsWith('/uploads/')) return `http://localhost:5000${image}`; // Uploaded images
    if (image.startsWith('/images/')) return image; // Static images in public folder
    return `http://localhost:5000${image}`; // Default server path
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center w-full hover:shadow-lg transition relative">
      
      {/* Stock Status Badge */}
      {(!product.stock || product.stock === 0 || product.isActive === false) && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Out of Stock
        </div>
      )}
      
      {/* Image */}
      <img
        src={getImageUrl(product.image)}
        alt={product.title}
        className={`w-32 h-32 object-contain ${(!product.stock || product.stock === 0 || product.isActive === false) ? 'opacity-50' : ''}`}
      />

      {/* Category */}
      <p className="text-gray-400 text-sm mt-2">{product.category}</p>

      {/* Title */}
      <h3 className="text-base font-semibold text-center mt-1">
        {product.title}
      </h3>

      {/* Prices */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-green-600 font-bold text-lg">
          {formatCurrency(product.price)}
        </span>

        <span className="line-through text-gray-400 text-sm">
          {formatCurrency(product.oldPrice)}
        </span>
      </div>

      {/* Add Button */}
      <button
        onClick={addToCart}
        disabled={!product.stock || product.stock === 0 || product.isActive === false}
        className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition ${
          !product.stock || product.stock === 0 || product.isActive === false
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-green-600 hover:bg-[#8B623F] text-white'
        }`}
      >
        {!product.stock || product.stock === 0 || product.isActive === false ? 'Out of Stock' : 'Add'}
      </button>
    </div>
  );
};

export default ProductCard;
