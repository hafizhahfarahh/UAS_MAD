const router = require("express").Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

const { verifyToken } = require("../middleware/authMiddleware");

// USER ONLY
router.post("/", verifyToken, createBooking);
router.get("/me", verifyToken, getMyBookings);
router.put("/:bookingId/cancel", verifyToken, cancelBooking);

module.exports = router;