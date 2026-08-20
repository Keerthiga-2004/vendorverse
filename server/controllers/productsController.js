const Product = require("../models/Product");

// ==========================================
// GET ALL PRODUCTS
// GET /api/products
// ==========================================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name shopName");

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET PRODUCTS OF LOGGED-IN VENDOR
// GET /api/products/vendor
// ==========================================
const getVendorProducts = async (req, res) => {
  try {
    console.log("🔍 Getting products for vendor:", req.user.id);

    const products = await Product.find({
      vendor: req.user.id,
    }).sort({ createdAt: -1 });

    console.log("✅ Vendor products:", products);

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Get Vendor Products Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADD NEW PRODUCT
// POST /api/products
// ==========================================
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      unit,
      available,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      unit: unit || "per item",
      available:
        available !== undefined
          ? available === true || available === "true"
          : true,

      image: req.file ? req.file.path : "",

      // IMPORTANT:
      // Vendor ID comes from the JWT
      vendor: req.user.id,
    });

    console.log("✅ Product Created:", product._id);

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Add Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ==========================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendor", "name shopName");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ Get Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// PUT /api/products/:id
// ==========================================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Check ownership
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    // Only update allowed product fields
    const {
      name,
      description,
      price,
      category,
      unit,
      available,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        unit,
        available:
          available !== undefined
            ? available === true || available === "true"
            : product.available,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
// DELETE /api/products/:id
// ==========================================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    // Check ownership
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  getProducts,
  getVendorProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};