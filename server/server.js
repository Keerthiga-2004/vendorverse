const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
app.use(cors());

connectDB();



// Middleware
app.use(express.json());

// Import Routes
const productsRoutes = require("./routes/productsRoutes");
const authRoutes = require("./routes/authRoutes");

// Use Routes
app.use("/api/products", productsRoutes);
app.use("/api/users", authRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VendorVerse Backend Running Successfully",
    version: "1.0.0",
  });
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});