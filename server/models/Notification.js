const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Who receives this notification
    recipient: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    // Who triggered it (optional — system notifications won't have one)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
    },
    type: {
      type:     String,
      required: true,
      enum: [
        "new_review",       // customer reviewed vendor's shop
        "review_reply",     // vendor replied to customer's review
        "new_message",      // new chat message received
        "wishlist_save",    // customer saved vendor to wishlist
      ],
    },
    // Human-readable message shown in the UI
    message: {
      type:     String,
      required: true,
      trim:     true,
    },
    // Optional deep link — where to go when notification is clicked
    link: {
      type:    String,
      default: "",
    },
    read: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast per-recipient queries, newest first
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);