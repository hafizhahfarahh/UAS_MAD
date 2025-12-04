const pool = require("../../config/db");

exports.createPayment = async (req,res)=>{
  const {booking_id,amount,method}=req.body;

  await pool.query(
    "INSERT INTO payments(booking_id,user_id,amount,method) VALUES($1,$2,$3,$4)",
    [booking_id,req.user.id,amount,method]
  );

  res.json({message:"Payment created"});
};
