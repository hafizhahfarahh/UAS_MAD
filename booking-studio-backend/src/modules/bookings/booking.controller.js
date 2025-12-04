const pool = require("../../config/db");

exports.createBooking = async (req,res)=>{
  const {studio_id,start_time,end_time,total_price} = req.body;

  const overlap = await pool.query(
    `SELECT * FROM bookings WHERE studio_id=$1 AND (start_time < $3 AND end_time > $2)`,
    [studio_id,start_time,end_time]
  );

  if(overlap.rows.length) return res.status(400).json({ message:"Slot not available" });

  await pool.query(
    "INSERT INTO bookings(user_id,studio_id,start_time,end_time,total_price) VALUES($1,$2,$3,$4,$5)",
    [req.user.id,studio_id,start_time,end_time,total_price]
  );

  res.json({message:"Booking created"});
};
