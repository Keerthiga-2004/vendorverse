const Message            = require("../models/Message");
const User               = require("../models/User");
const createNotification = require("../utils/notificationHelper"); // ✅ ADDED

// GET all conversations — unchanged
const getConversations = async (req, res) => {
  try {
    const userId   = req.user._id.toString();
    const userRole = req.user.role;
    const field    = userRole === "vendor" ? "vendor" : "customer";

    const messages = await Message.find({ [field]: userId })
      .sort({ createdAt: -1 })
      .populate("customer", "name email")
      .populate("vendor",   "name shopName category");

    const conversationMap = {};
    messages.forEach((msg) => {
      const partnerId =
        userRole === "vendor"
          ? msg.customer._id.toString()
          : msg.vendor._id.toString();

      if (!conversationMap[partnerId]) {
        conversationMap[partnerId] = {
          partnerId,
          partner:
            userRole === "vendor"
              ? { _id: msg.customer._id, name: msg.customer.name, role: "user" }
              : { _id: msg.vendor._id, name: msg.vendor.shopName || msg.vendor.name, category: msg.vendor.category, role: "vendor" },
          lastMessage: {
            text:       msg.text,
            createdAt:  msg.createdAt,
            senderRole: msg.senderRole,
          },
          unreadCount: 0,
          conversationId:
            userRole === "vendor"
              ? `${msg.customer._id}_${userId}`
              : `${userId}_${msg.vendor._id}`,
        };
      }
      if (!msg.read && msg.senderRole !== userRole) {
        conversationMap[partnerId].unreadCount++;
      }
    });

    const conversations = Object.values(conversationMap).sort(
      (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET messages in a conversation — unchanged
const getMessages = async (req, res) => {
  try {
    const { customerId, vendorId } = req.params;
    const userId = req.user._id.toString();

    if (userId !== customerId && userId !== vendorId) {
      return res.status(403).json({ success: false, message: "Not authorized to view this conversation" });
    }

    const messages = await Message.find({ customer: customerId, vendor: vendorId })
      .sort({ createdAt: 1 })
      .populate("sender", "name");

    const userRole = userId === vendorId ? "vendor" : "user";
    await Message.updateMany(
      { customer: customerId, vendor: vendorId, senderRole: { $ne: userRole }, read: false },
      { read: true }
    );

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEND a message
const sendMessage = async (req, res) => {
  try {
    const userId               = req.user._id.toString();
    const { text, customerId } = req.body;
    const vendorId             = req.params.vendorId;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }
    if (text.trim().length > 2000) {
      return res.status(400).json({ success: false, message: "Message is too long (max 2000 characters)" });
    }

    let resolvedCustomerId, resolvedVendorId, senderRole;

    if (req.user.role === "vendor") {
      if (!customerId) {
        return res.status(400).json({ success: false, message: "customerId is required when vendor sends a message" });
      }
      resolvedVendorId   = userId;
      resolvedCustomerId = customerId;
      senderRole         = "vendor";
    } else {
      resolvedCustomerId = userId;
      resolvedVendorId   = vendorId;
      senderRole         = "user";
    }

    const vendor = await User.findById(resolvedVendorId).select("role shopName name");
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const message = await Message.create({
      customer:   resolvedCustomerId,
      vendor:     resolvedVendorId,
      sender:     userId,
      senderRole,
      text:       text.trim(),
    });

    const populated = await message.populate("sender", "name");

    // ✅ ADDED: notify the recipient of the new message
    const recipientId = senderRole === "vendor" ? resolvedCustomerId : resolvedVendorId;
    const senderName  = req.user.shopName || req.user.name;
    const convId      = `${resolvedCustomerId}_${resolvedVendorId}`;

    await createNotification({
      recipient: recipientId,
      sender:    userId,
      type:      "new_message",
      message:   `${senderName} sent you a message`,
      link:      `/chat/${convId}`,
    });

    res.status(201).json({ success: true, message: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET unread count — unchanged
const getUnreadCount = async (req, res) => {
  try {
    const userId   = req.user._id.toString();
    const userRole = req.user.role;
    const field    = userRole === "vendor" ? "vendor" : "customer";

    const count = await Message.countDocuments({
      [field]:    userId,
      senderRole: { $ne: userRole },
      read:       false,
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getConversations, getMessages, sendMessage, getUnreadCount };