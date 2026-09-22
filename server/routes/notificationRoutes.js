const express = require("express");
const router  = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getNotifications,
  getUnreadCount,
  markOneRead,
  markAllRead,
} = require("../controllers/notificationController");

// All notification routes require auth
router.get("/",                  protect, getNotifications);
router.get("/unread-count",      protect, getUnreadCount);
router.put("/read-all",          protect, markAllRead);
router.put("/:id/read",          protect, markOneRead);

module.exports = router;