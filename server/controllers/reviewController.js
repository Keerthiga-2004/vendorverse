const Review             = require("../models/Review");
const User               = require("../models/User");
const createNotification = require("../utils/notificationHelper"); // ✅ ADDED

// GET reviews for a vendor (public) — unchanged
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vendor: req.params.vendorId })
      .populate("customer", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD a review (customers only)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const vendorId = req.params.vendorId;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }
    if (comment.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Comment must be at least 5 characters" });
    }
    if (req.user.role !== "user") {
      return res.status(403).json({ success: false, message: "Only customers can submit reviews" });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    if (vendorId === req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot review your own shop" });
    }

    const review = await Review.create({
      vendor:   vendorId,
      customer: req.user._id,
      rating:   Number(rating),
      comment:  comment.trim(),
    });

    // Recalculate vendor rating
    const allReviews = await Review.find({ vendor: vendorId });
    const newCount   = allReviews.length;
    const newRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / newCount;
    await User.findByIdAndUpdate(vendorId, {
      rating:      parseFloat(newRating.toFixed(1)),
      reviewCount: newCount,
    });

    const populated = await review.populate("customer", "name");

    // ✅ ADDED: notify vendor of new review
    await createNotification({
      recipient: vendorId,
      sender:    req.user._id,
      type:      "new_review",
      message:   `${req.user.name} left a ${rating}★ review on your shop`,
      link:      `/dashboard/reviews`,
    });

    res.status(201).json({ success: true, message: "Review added successfully", review: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You have already reviewed this vendor" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// VENDOR REPLY to a review
const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ success: false, message: "Reply text is required" });
    }

    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (review.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to reply to this review" });
    }

    review.vendorReply = reply.trim();
    await review.save();

    const populated = await review.populate("customer", "name");

    // ✅ ADDED: notify customer that vendor replied
    await createNotification({
      recipient: review.customer,
      sender:    req.user._id,
      type:      "review_reply",
      message:   `${req.user.shopName || req.user.name} replied to your review`,
      link:      `/vendor/${req.user._id}`,
    });

    res.status(200).json({ success: true, message: "Reply posted successfully", review: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a review — unchanged
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    if (review.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    const vendorId = review.vendor;
    await review.deleteOne();

    const remaining = await Review.find({ vendor: vendorId });
    const newCount  = remaining.length;
    const newRating = newCount > 0
      ? remaining.reduce((sum, r) => sum + r.rating, 0) / newCount
      : 0;
    await User.findByIdAndUpdate(vendorId, {
      rating:      newCount > 0 ? parseFloat(newRating.toFixed(1)) : 0,
      reviewCount: newCount,
    });

    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, addReview, replyToReview, deleteReview };