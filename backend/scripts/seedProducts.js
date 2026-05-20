import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import connectDB from "../config/database.js";

dotenv.config();

const products = [
  { title: "Carrot 500g", category: "Vegetables", price: 44, oldPrice: 50, image: "/images/carrot.png", rating: 4.3, stock: 100 },
  { title: "Tomato 1kg", category: "Vegetables", price: 32, oldPrice: 40, image: "/images/tomato.png", rating: 4.4, stock: 150 },
  { title: "Potato 1kg", category: "Vegetables", price: 28, oldPrice: 35, image: "/images/potato.png", rating: 4.5, stock: 200 },
  { title: "Onion 1kg", category: "Vegetables", price: 52, oldPrice: 60, image: "/images/onion.png", rating: 4.2, stock: 180 },
  { title: "Cabbage 1pc", category: "Vegetables", price: 40, oldPrice: 48, image: "/images/cabbage.png", rating: 4.3, stock: 80 },
  { title: "Broccoli 500g", category: "Vegetables", price: 82, oldPrice: 95, image: "/images/broccoli.png", rating: 4.6, stock: 60 },
  { title: "Cauliflower 1pc", category: "Vegetables", price: 55, oldPrice: 65, image: "/images/cauliflower.png", rating: 4.4, stock: 70 },
  { title: "Beans 500g", category: "Vegetables", price: 60, oldPrice: 75, image: "/images/beans.png", rating: 4.3, stock: 90 },
  { title: "Spinach 1 bunch", category: "Vegetables", price: 30, oldPrice: 35, image: "/images/spinach.png", rating: 4.1, stock: 120 },
  { title: "Green Peas 500g", category: "Vegetables", price: 70, oldPrice: 85, image: "/images/peas.png", rating: 4.6, stock: 100 },
  { title: "Beetroot 1kg", category: "Vegetables", price: 48, oldPrice: 60, image: "/images/beetroot.png", rating: 4.2, stock: 50 },
  { title: "Bottle Gourd 1pc", category: "Vegetables", price: 45, oldPrice: 55, image: "/images/bottle-gourd.png", rating: 4.2, stock: 40 },
  { title: "Bitter Gourd 500g", category: "Vegetables", price: 50, oldPrice: 60, image: "/images/bitter-gourd.png", rating: 4.0, stock: 30 },
  { title: "Capsicum 500g", category: "Vegetables", price: 80, oldPrice: 95, image: "/images/capsicum.png", rating: 4.5, stock: 60 },
  { title: "Corn 1pc", category: "Vegetables", price: 30, oldPrice: 40, image: "/images/corn.png", rating: 4.4, stock: 100 },
  { title: "Garlic 250g", category: "Vegetables", price: 65, oldPrice: 75, image: "/images/garlic.png", rating: 4.6, stock: 80 },
  { title: "Ginger 250g", category: "Vegetables", price: 55, oldPrice: 70, image: "/images/ginger.png", rating: 4.5, stock: 70 },
  { title: "Cucumber 1kg", category: "Vegetables", price: 45, oldPrice: 55, image: "/images/cucumber.png", rating: 4.4, stock: 90 },
  { title: "Sweet Potato 1kg", category: "Vegetables", price: 65, oldPrice: 80, image: "/images/sweet-potato.png", rating: 4.6, stock: 60 },
  { title: "Green Chilli 100g", category: "Vegetables", price: 15, oldPrice: 25, image: "/images/chilli.png", rating: 4.3, stock: 150 },
  { title: "Apple 1kg", category: "Fruits", price: 90, oldPrice: 100, image: "/images/apple.png", rating: 4.7, stock: 120 },
  { title: "Banana 12pcs", category: "Fruits", price: 60, oldPrice: 70, image: "/images/banana.png", rating: 4.5, stock: 200 },
  { title: "Orange 1kg", category: "Fruits", price: 85, oldPrice: 95, image: "/images/orange.png", rating: 4.6, stock: 150 },
  { title: "Grapes 500g", category: "Fruits", price: 75, oldPrice: 90, image: "/images/grapes.png", rating: 4.5, stock: 80 },
  { title: "Watermelon 1pc", category: "Fruits", price: 120, oldPrice: 150, image: "/images/watermelon.png", rating: 4.3, stock: 50 },
  { title: "Papaya 1pc", category: "Fruits", price: 60, oldPrice: 80, image: "/images/papaya.png", rating: 4.4, stock: 40 },
  { title: "Pomegranate 1kg", category: "Fruits", price: 150, oldPrice: 180, image: "/images/pomegranate.png", rating: 4.7, stock: 30 },
  { title: "Mango 1kg", category: "Fruits", price: 140, oldPrice: 160, image: "/images/mango.png", rating: 4.8, stock: 100 },
  { title: "Guava 1kg", category: "Fruits", price: 55, oldPrice: 65, image: "/images/guava.png", rating: 4.2, stock: 60 },
  { title: "Strawberry 200g", category: "Fruits", price: 120, oldPrice: 150, image: "/images/strawberry.png", rating: 4.6, stock: 40 },
  { title: "Kiwi 3pcs", category: "Fruits", price: 90, oldPrice: 110, image: "/images/kiwi.png", rating: 4.4, stock: 50 },
  { title: "Pineapple 1pc", category: "Fruits", price: 85, oldPrice: 100, image: "/images/pineapple.png", rating: 4.5, stock: 35 },
  { title: "Coconut 1pc", category: "Fruits", price: 45, oldPrice: 55, image: "/images/coconut.png", rating: 4.3, stock: 70 },
  { title: "Dragon Fruit 1pc", category: "Fruits", price: 180, oldPrice: 200, image: "/images/dragonfruit.png", rating: 4.6, stock: 20 },
  { title: "Blueberry 125g", category: "Fruits", price: 220, oldPrice: 250, image: "/images/blueberry.png", rating: 4.7, stock: 25 },
];

const seedProducts = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log("✅ Cleared existing products");

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();

