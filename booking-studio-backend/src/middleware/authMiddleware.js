const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Akses ditolak. Token diperlukan." });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token telah kadaluarsa" });
      }
      return res.status(403).json({ message: "Token tidak valid" });
    }
    
    req.user = user;
    next();
  });
};