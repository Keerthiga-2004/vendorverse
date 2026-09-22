const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    password:     { type: String, required: true },
    phone:        { type: String, default: "" },
    address:      { type: String, default: "" },
    city:         { type: String, default: "" },
    role:         { type: String, enum: ["user", "vendor", "admin"], default: "user" },

    // Vendor fields
    shopName:     { type: String, default: "" },
    category:     { type: String, default: "" },
    description:  { type: String, default: "" },
    openingHours: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    coverImage:   { type: String, default: "" },
    isOpen:       { type: Boolean, default: true },
    emoji:        { type: String, default: "🏪" },

    // Computed from reviews
    rating:       { type: Number, default: 0 },
    reviewCount:  { type: Number, default: 0 },

    // Customer wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // ✅ ADDED: Location coordinates
    // Vendors set these via My Shop; used for map embed and distance filter
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);