const jwt = require("jsonwebtoken");

module.exports = (user) => 
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
