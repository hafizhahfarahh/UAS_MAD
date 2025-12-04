const pool = require("../../config/db");

exports.getStudios = async (_,res)=>{
  const data = await pool.query("SELECT * FROM studios");
  res.json(data.rows);
};

exports.getStudioDetail = async (req,res)=>{
  const studio = await pool.query("SELECT * FROM studios WHERE id=$1",[req.params.id]);
  res.json(studio.rows[0]);
};
