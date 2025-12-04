const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const {createBooking} = require("./booking.controller");

router.post("/", auth, createBooking);

module.exports = router;
