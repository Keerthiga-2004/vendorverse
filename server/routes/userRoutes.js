const express  = require("express");
const router   = express.Router();
const protect  = require("../middleware/authMiddleware");

const {
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  getVendorById,
  toggleWishlist, // ✅ ADDED
  getWishlist,    // ✅ ADDED
} = require("../controllers/userController");

// Vendor profile (authenticated)
router.get("/profile", protect, getVendorProfile);
router.put("/profile", protect, updateVendorProfile);

// Public vendor listing + single vendor
router.get("/vendors",     getAllVendors);
router.get("/vendors/:id", getVendorById);

// ✅ ADDED: Wishlist (customers)
router.get("/wishlist",              protect, getWishlist);
router.post("/wishlist/:vendorId",   protect, toggleWishlist);

module.exports = router;