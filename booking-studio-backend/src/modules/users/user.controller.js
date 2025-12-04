const pool = require("../../config/db");

exports.getProfile = async (req,res)=>{
  const user = await pool.query("SELECT id,name,email,role FROM users WHERE id=$1",[req.user.id]);
  res.json(user.rows[0]);
};
