const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

const {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");

router.route("/")
  .get(getProducts)
  .post(protect, addProduct);

router.route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;