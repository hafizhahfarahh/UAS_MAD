const express = require("express");
const cors = require("cors");

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const studioRoutes = require("./modules/studios/studio.routes");
const bookingRoutes = require("./modules/bookings/booking.routes");
const reviewRoutes = require("./modules/reviews/review.routes");
const paymentRoutes = require("./modules/payments/payment.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/studios", studioRoutes);
app.use("/bookings", bookingRoutes);
app.use("/reviews", reviewRoutes);
app.use("/payments", paymentRoutes);

module.exports = app;
