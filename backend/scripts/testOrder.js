import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js";
import User from "../models/User.js";
import connectDB from "../config/database.js";

dotenv.config();

const testOrder = async () => {
  try {
    await connectDB();
    
    // Get a test user
    const user = await User.findOne({ role: "buyer" });
    
    if (!user) {
      console.log("❌ No buyer user found. Please create a user first.");
      process.exit(1);
    }

    console.log(`✅ Found user: ${user.email}`);

    // Test order data
    const testOrderData = {
      userId: user._id,
      items: [
        {
          id: "test-product-1",
          title: "Test Product",
          price: 100,
          qty: 2,
          image: "/images/test.png",
        },
      ],
      totalAmount: 200,
      address: {
        firstName: "Test",
        lastName: "User",
        street: "123 Test St",
        city: "Test City",
        state: "Test State",
        zip: "12345",
        country: "Test Country",
        phone: "1234567890",
      },
      paymentMethod: "COD",
      status: "Pending",
      paymentStatus: "Pending",
    };

    console.log("📦 Creating test order...");
    const order = await Order.create(testOrderData);
    
    console.log("✅ Order created successfully!");
    console.log("Order ID:", order.orderId);
    console.log("Order:", JSON.stringify(order, null, 2));
    
    // Clean up
    await Order.deleteOne({ _id: order._id });
    console.log("🧹 Test order cleaned up");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error testing order:", error);
    console.error("Error details:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
    process.exit(1);
  }
};

testOrder();

