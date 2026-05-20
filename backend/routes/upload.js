import express from "express";
import { upload, uploadImage } from "../controllers/uploadController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

// Upload product image
router.post("/image", protect, admin, upload.single("image"), uploadImage);

export default router;
