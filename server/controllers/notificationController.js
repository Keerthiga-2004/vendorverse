const Notification = require("../models/Notification");

// ─────────────────────────────────────────────────────────
// GET notifications for the logged-in user
// GET /api/notifications
// Returns latest 30, newest first
// ─────────────────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("sender", "name shopName");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
// GET unread notification count
// GET /api/notifications/unread-count
// Used by Navbar badge — lightweight, no populate needed
// ─────────────────────────────────────────────────────────
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read:      false,
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
// MARK a single notification as read
// PUT /api/notifications/:id/read
// ─────────────────────────────────────────────────────────
const markOneRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
// MARK ALL notifications as read
// PUT /api/notifications/read-all
// ─────────────────────────────────────────────────────────
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markOneRead,
  markAllRead,
};