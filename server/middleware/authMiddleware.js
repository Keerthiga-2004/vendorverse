const jwt  = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No Token Provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT signature — process.env.JWT_SECRET (Task 9 preserved)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: fetch the real user from MongoDB so req.user.role is populated.
    // The JWT payload is only { id, iat, exp } — role is NOT encoded in the token.
    // Without this lookup, req.user.role is undefined everywhere in the app.
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // req.user is now the full Mongoose document:
    // _id, name, email, role, shopName, category, wishlist, etc.
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = protect;