import Order from "../models/Order.js";

// @desc    Get all orders (admin) or user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    // Build query
    const query = {};

    // If user is not admin, only show their orders
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch orders",
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Check if user owns the order or is admin
    if (req.user.role !== "admin" && order.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch order",
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        error: "User not authenticated",
      });
    }

    const { items, totalAmount, address, paymentMethod } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Order items are required",
      });
    }

    // Validate each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.id && !item._id) {
        return res.status(400).json({
          error: `Item ${i + 1} is missing an id`,
          details: `Item at index ${i} must have an id field`,
        });
      }
      if (!item.title) {
        return res.status(400).json({
          error: `Item ${i + 1} is missing a title`,
          details: `Item at index ${i} must have a title field`,
        });
      }
      if (item.price === undefined || item.price === null || isNaN(item.price)) {
        return res.status(400).json({
          error: `Item ${i + 1} has an invalid price`,
          details: `Item at index ${i} must have a valid numeric price`,
        });
      }
      if (!item.qty || item.qty < 1 || isNaN(item.qty)) {
        return res.status(400).json({
          error: `Item ${i + 1} has an invalid quantity`,
          details: `Item at index ${i} must have a quantity of at least 1`,
        });
      }
    }

    if (!totalAmount || totalAmount <= 0 || isNaN(totalAmount)) {
      return res.status(400).json({
        error: "Valid total amount is required",
      });
    }

    if (!address || typeof address !== "object" || Array.isArray(address)) {
      return res.status(400).json({
        error: "Delivery address is required and must be an object",
        details: "Address should contain fields like firstName, lastName, street, city, state, zip, country, phone",
      });
    }

    // Validate minimum required address fields
    if (!address.street || !address.city || !address.state) {
      return res.status(400).json({
        error: "Address is missing required fields",
        details: "Address must have at least: street, city, and state",
      });
    }

    if (!paymentMethod || !["COD", "UPI", "CARD"].includes(paymentMethod)) {
      return res.status(400).json({
        error: "Valid payment method is required (COD, UPI, or CARD)",
      });
    }

    // Prepare items with proper structure
    const formattedItems = items.map(item => ({
      id: String(item.id || item._id || item.id),
      title: String(item.title),
      price: parseFloat(item.price),
      qty: parseInt(item.qty),
      image: item.image || "/images/default.png",
    }));

    // Create order object (orderId will be generated in pre-save hook)
    const orderData = {
      userId: req.user._id,
      items: formattedItems,
      totalAmount: parseFloat(totalAmount),
      address,
      paymentMethod,
      status: "Pending",
      paymentStatus: "Pending",
    };

    // Create order
    const order = await Order.create(orderData);

    const populatedOrder = await Order.findById(order._id).populate("userId", "name email");

    res.status(201).json({
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    console.error("User:", req.user ? { id: req.user._id, email: req.user.email } : "No user");
    
    // More detailed error messages
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.message,
        fields: error.errors,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate order ID. Please try again.",
      });
    }

    res.status(500).json({
      error: error.message || "Failed to create order",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrder = async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    // Update fields
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();

    const populatedOrder = await Order.findById(order._id).populate("userId", "name email");

    res.json({
      message: "Order updated successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      error: error.message || "Failed to update order",
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    await order.deleteOne();

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({
      error: error.message || "Failed to delete order",
    });
  }
};

