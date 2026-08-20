const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const {
  getProducts,
  getVendorProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

// Get all products
router.get("/", getProducts);

// Get products belonging to logged-in vendor
// IMPORTANT: this must come BEFORE /:id
router.get("/vendor", protect, getVendorProducts);

// Add product
router.post(
  "/",
  protect,
  upload.single("image"),
  addProduct
);

// Get single product
router.get("/:id", getProductById);

// Update product
router.put("/:id", protect, updateProduct);

// Delete product
router.delete("/:id", protect, deleteProduct);

module.exports = router;