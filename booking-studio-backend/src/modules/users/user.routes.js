const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const { getProfile } = require("./user.controller");

router.get("/me", auth, getProfile);

module.exports = router;
