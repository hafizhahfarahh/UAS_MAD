const router = require("express").Router();
const auth = require("../../middlewares/auth.middleware");
const {createPayment} = require("./payment.controller");

router.post("/", auth, createPayment);

module.exports=router;
