import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  image: {
    type: String,
  },
});

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  phone: String,
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true, // Will be generated in pre-validate hook before validation
      index: true, // Single index definition
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    address: addressSchema,
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    trackingNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate order ID before validation (runs before validation)
orderSchema.pre("validate", async function (next) {
  // Only generate if orderId doesn't exist
  if (!this.orderId) {
    try {
      // Generate unique order ID using ObjectId + timestamp for guaranteed uniqueness
      const objectId = new mongoose.Types.ObjectId();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      this.orderId = "OD" + timestamp + "-" + random + "-" + objectId.toString().substring(0, 6).toUpperCase();
    } catch (error) {
      console.error("Error generating orderId:", error);
      return next(error);
    }
  }
  next();
});

// Index for faster queries
orderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;

