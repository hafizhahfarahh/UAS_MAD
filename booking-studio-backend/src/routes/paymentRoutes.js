const router = require("express").Router();
const { payBooking } = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, payBooking);

module.exports = router;