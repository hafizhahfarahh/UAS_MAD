const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ 
    message: "Booking Studio API", 
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      studios: "/api/studios",
      bookings: "/api/bookings",
      payments: "/api/payments",
      reviews: "/api/reviews"
    }
  });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/studios", require("./routes/studioRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}`);
});