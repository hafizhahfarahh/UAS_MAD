const router=require("express").Router();
const auth=require("../../middlewares/auth.middleware");
const {createReview}=require("./review.controller");

router.post("/", auth, createReview);

module.exports=router;
