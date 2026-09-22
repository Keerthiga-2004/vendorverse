const express = require("express");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const {
  getProducts,
  getVendorProducts,
  getProductsByVendor,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getVendorAnalytics,
} = require("../controllers/productsController");

// Get all products
router.get("/", getProducts);

// Get products belonging to logged-in vendor
router.get("/vendor", protect, getVendorProducts);

// Get products belonging to a specific public vendor
// IMPORTANT: Keep this BEFORE /:id
router.get("/vendor/:vendorId", getProductsByVendor);

// Get analytics for logged-in vendor
// IMPORTANT: Keep this BEFORE /:id
router.get("/analytics", protect, getVendorAnalytics);

// Add product
router.post("/", protect, upload.single("image"), addProduct);

// Get single product
router.get("/:id", getProductById);

// Update product
router.put("/:id", protect, upload.single("image"), updateProduct);

// Delete product
router.delete("/:id", protect, deleteProduct);

module.exports = router;