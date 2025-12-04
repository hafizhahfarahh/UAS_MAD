const pool = require("../../config/db");

exports.createReview=async(req,res)=>{
  const {booking_id,rating,comment} = req.body;

  await pool.query(
    "INSERT INTO reviews(booking_id,user_id,rating,comment)VALUES($1,$2,$3,$4)",
    [booking_id,req.user.id,rating,comment]
  );

  res.json({message:"Review added"});
};
