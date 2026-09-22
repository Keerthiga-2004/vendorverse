const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // The two participants — identifies the conversation uniquely
    customer: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    vendor: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    // Who sent this specific message
    sender: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },
    // "customer" or "vendor" — quick role check without an extra populate
    senderRole: {
      type: String,
      enum: ["user", "vendor"],
      required: true,
    },
    text: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 2000,
    },
    // Has the other party read this message
    read: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast conversation lookup
messageSchema.index({ customer: 1, vendor: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);