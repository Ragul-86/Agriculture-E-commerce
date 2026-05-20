import express from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// User and admin routes
router.get("/", getOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);

// Admin only routes
router.put("/:id", admin, updateOrder);
router.delete("/:id", admin, deleteOrder);

export default router;

