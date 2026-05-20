import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import connectDB from "../config/database.js";

dotenv.config();

const checkProducts = async () => {
  try {
    await connectDB();
    
    const count = await Product.countDocuments();
    console.log(`📦 Total products in database: ${count}`);
    
    if (count === 0) {
      console.log("⚠️  No products found in database!");
      console.log("💡 Run 'npm run seed' to seed products");
    } else {
      const products = await Product.find().limit(5);
      console.log("\n📋 Sample products:");
      products.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title} - ₹${p.price}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking products:", error);
    process.exit(1);
  }
};

checkProducts();

