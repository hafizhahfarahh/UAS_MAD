const pool = require("../../config/db");
const bcrypt = require("bcryptjs");
const generateToken = require("../../utils/generateToken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const user = await pool.query(
    "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
    [name, email, hashed]
  );

  res.json({ message:"Register success", user:user.rows[0] });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  if (!user.rows.length) return res.status(404).json({ message:"User not found"});

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(400).json({ message:"Wrong password" });

  const token = generateToken(user.rows[0]);
  res.json({ message:"Login success", token });
};
