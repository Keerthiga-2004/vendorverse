const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getReviews,
  addReview,
  replyToReview,
  deleteReview,
} = require("../controllers/reviewController");

// Public — anyone can read reviews for a vendor
router.get("/:vendorId", getReviews);

// Protected — customer must be logged in to submit
router.post("/:vendorId", protect, addReview);

// Protected — vendor replies to a review
router.put("/:reviewId/reply", protect, replyToReview);

// Protected — customer deletes their own review
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;