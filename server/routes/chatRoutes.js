const express  = require("express");
const router   = express.Router();
const protect  = require("../middleware/authMiddleware");

const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
} = require("../controllers/chatController");

// All chat routes require authentication
// GET conversations list for logged-in user
router.get("/conversations", protect, getConversations);

// GET unread count (for badge)
router.get("/unread", protect, getUnreadCount);

// GET messages between customer and vendor
router.get("/:customerId/:vendorId", protect, getMessages);

// POST send a message (vendor ID in params)
router.post("/:vendorId", protect, sendMessage);

module.exports = router;