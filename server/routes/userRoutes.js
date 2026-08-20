const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
    getVendorById
} = require("../controllers/userController");

router.get("/profile", protect, getVendorProfile);

router.put("/profile", protect, updateVendorProfile);
router.get("/vendors", getAllVendors);
router.get("/vendors/:id", getVendorById);

module.exports = router;