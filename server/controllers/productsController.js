const Product = require("../models/Product");
const Review = require("../models/Review");

// ==========================================
// GET ALL PRODUCTS
// ==========================================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "vendor",
      "name shopName"
    );

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ==========================================
// GET PRODUCTS OF LOGGED-IN VENDOR
// GET /api/products/vendor
// ==========================================
const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET PRODUCTS OF A SPECIFIC PUBLIC VENDOR
// GET /api/products/vendor/:vendorId
// ==========================================
const getProductsByVendor = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.params.vendorId,
    })
      .populate("vendor", "name shopName")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// ADD NEW PRODUCT
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
      vendor: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "vendor",
      "name shopName"
    );

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE PRODUCT
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

    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const {
      name,
      description,
      price,
      category,
      unit,
      available,
    } = req.body;

    const image = req.file ? req.file.path : product.image;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        unit,
        image,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET VENDOR ANALYTICS
// GET /api/products/analytics
// ==========================================
const getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = req.user.id;

    // ── Product stats ────────────────────────────────────
    const allProducts = await Product.find({
      vendor: vendorId,
    });

    const totalProducts = allProducts.length;

    const availableProducts = allProducts.filter(
      (p) => p.available
    ).length;

    const unavailableProducts =
      totalProducts - availableProducts;

    // Products grouped by category
    const categoryMap = {};

    allProducts.forEach((p) => {
      const cat = p.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const productsByCategory = Object.entries(categoryMap)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Top 5 products by price
    const topProductsByPrice = [...allProducts]
      .sort((a, b) => b.price - a.price)
      .slice(0, 5)
      .map((p) => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image,
        available: p.available,
      }));

    // ── Review stats ─────────────────────────────────────
    const allReviews = await Review.find({
      vendor: vendorId,
    })
      .populate("customer", "name")
      .sort({ createdAt: -1 });

    const totalReviews = allReviews.length;

    const avgRating =
      totalReviews > 0
        ? parseFloat(
            (
              allReviews.reduce(
                (sum, r) => sum + r.rating,
                0
              ) / totalReviews
            ).toFixed(1)
          )
        : 0;

    // Rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map(
      (star) => ({
        star,
        count: allReviews.filter(
          (r) => r.rating === star
        ).length,
      })
    );

    // Reviews per month — last 6 months
    const now = new Date();

    const reviewsByMonth = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const nextMonth = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        1
      );

      const label = monthDate.toLocaleString(
        "en-IN",
        {
          month: "short",
          year: "2-digit",
        }
      );

      const count = allReviews.filter((r) => {
        const d = new Date(r.createdAt);

        return d >= monthDate && d < nextMonth;
      }).length;

      reviewsByMonth.push({
        month: label,
        count,
      });
    }

    // Products added per month — last 6 months
    const productsByMonth = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const nextMonth = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        1
      );

      const label = monthDate.toLocaleString(
        "en-IN",
        {
          month: "short",
          year: "2-digit",
        }
      );

      const count = allProducts.filter((p) => {
        const d = new Date(p.createdAt);

        return d >= monthDate && d < nextMonth;
      }).length;

      productsByMonth.push({
        month: label,
        count,
      });
    }

    // Recent 5 reviews
    const recentReviews = allReviews
      .slice(0, 5)
      .map((r) => ({
        _id: r._id,
        customerName:
          r.customer?.name || "Customer",
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }));

    res.status(200).json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          available: availableProducts,
          unavailable: unavailableProducts,
          byCategory: productsByCategory,
          byMonth: productsByMonth,
          topByPrice: topProductsByPrice,
        },
        reviews: {
          total: totalReviews,
          averageRating: avgRating,
          breakdown: ratingBreakdown,
          byMonth: reviewsByMonth,
          recent: recentReviews,
        },
      },
    });
  } catch (error) {
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
  getProductsByVendor,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getVendorAnalytics,
};