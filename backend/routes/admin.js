import express from "express";
import {
  getDashboardStats,
  getAnalytics,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes are protected
router.use(protect);
router.use(admin);

// Dashboard and analytics
router.get("/dashboard", getDashboardStats);
router.get("/analytics", getAnalytics);

export default router;

