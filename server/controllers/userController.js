const User = require("../models/User");

// GET Vendor Profile
const getVendorProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.id).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.status(200).json(vendor);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE Vendor Profile
const updateVendorProfile = async (req, res) => {
  try {

    const updatedVendor = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      vendor: updatedVendor,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// GET ALL VENDORS
const getAllVendors = async (req, res) => {
  try {

    const vendors = await User.find({
      role: "vendor"
    }).select("-password");

    res.status(200).json(vendors);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const getVendorById = async (req, res) => {
  try {

    const vendor = await User.findById(req.params.id).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json(vendor);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
   getVendorById,
};