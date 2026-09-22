const User               = require("../models/User");
const createNotification = require("../utils/notificationHelper");

// ─── Haversine distance in km ─────────────────────────────
function haversineKm(lat1, lng1, lat2, lng2) {
  const R    = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET Vendor Profile — unchanged
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.user._id).select("-password");
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Vendor Profile
const updateVendorProfile = async (req, res) => {
  try {
    const {
      shopName, category, description,
      address, city, phone, openingHours, isOpen,
      lat, lng, // ✅ ADDED
    } = req.body;

    const allowedUpdates = {
      shopName, category, description,
      address, city, phone, openingHours, isOpen,
      // Only store valid numbers; null clears the field
      lat: lat !== undefined ? (lat === "" || lat === null ? null : Number(lat)) : undefined,
      lng: lng !== undefined ? (lng === "" || lng === null ? null : Number(lng)) : undefined,
    };

    // Remove keys not sent so we don't overwrite with undefined
    Object.keys(allowedUpdates).forEach(
      (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const updatedVendor = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      vendor:  updatedVendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL VENDORS — with distance sort support
const getAllVendors = async (req, res) => {
  try {
    const { search, category, city, sort, lat, lng } = req.query;

    const query = { role: "vendor" };

    if (category && category.trim()) query.category = category.trim();
    if (city && city.trim()) {
      query.city = { $regex: new RegExp(`^${city.trim()}$`, "i") };
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { shopName:    regex },
        { description: regex },
        { city:        regex },
      ];
    }

    // Default sort options (MongoDB-level)
    let sortOption = { createdAt: -1 };
    if (sort === "rating") sortOption = { rating: -1, reviewCount: -1 };

    let vendors = await User.find(query).select("-password").sort(sortOption);

    // ✅ ADDED: distance sort — done in JS after fetch because MongoDB
    // needs geospatial indexes for $near; Haversine on small datasets is fine
    if (sort === "distance" && lat && lng) {
      const customerLat = parseFloat(lat);
      const customerLng = parseFloat(lng);

      vendors = vendors
        .map((v) => {
          const obj = v.toObject();
          obj.distanceKm =
            v.lat != null && v.lng != null
              ? parseFloat(haversineKm(customerLat, customerLng, v.lat, v.lng).toFixed(1))
              : null;
          return obj;
        })
        .sort((a, b) => {
          // Vendors without coordinates go to the end
          if (a.distanceKm === null && b.distanceKm === null) return 0;
          if (a.distanceKm === null) return 1;
          if (b.distanceKm === null) return -1;
          return a.distanceKm - b.distanceKm;
        });
    }

    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET VENDOR BY ID — unchanged
const getVendorById = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id).select("-password");
    if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// TOGGLE WISHLIST — unchanged
const toggleWishlist = async (req, res) => {
  try {
    const customerId = req.user._id.toString();
    const vendorId   = req.params.vendorId;

    if (customerId === vendorId) {
      return res.status(400).json({ success: false, message: "You cannot save your own shop" });
    }

    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    const customer     = await User.findById(customerId);
    const alreadySaved = customer.wishlist.some((id) => id.toString() === vendorId);

    if (alreadySaved) {
      await User.findByIdAndUpdate(customerId, { $pull: { wishlist: vendorId } });
      return res.status(200).json({ success: true, saved: false, message: "Removed from wishlist" });
    } else {
      await User.findByIdAndUpdate(customerId, { $addToSet: { wishlist: vendorId } });
      await createNotification({
        recipient: vendorId,
        sender:    customerId,
        type:      "wishlist_save",
        message:   `${req.user.name} saved your shop to their wishlist`,
        link:      `/dashboard`,
      });
      return res.status(200).json({ success: true, saved: true, message: "Added to wishlist" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET WISHLIST — unchanged
const getWishlist = async (req, res) => {
  try {
    const customer = await User.findById(req.user._id)
      .populate({ path: "wishlist", select: "-password" });
    if (!customer) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json(customer.wishlist || []);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  getVendorById,
  toggleWishlist,
  getWishlist,
};