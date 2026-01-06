const db = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
    [name, email, hashedPassword],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        return res.status(500).json({ message: "Register gagal" });
      }
      res.json({ message: "Register berhasil" });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password harus diisi" });
  }
  
  db.query(
    "SELECT id, name, email, password, role FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (!result.length) {
        return res.status(401).json({ message: "Email tidak ditemukan" });
      }
      
      const user = result[0];
      
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Password salah" });
      }
      
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  );
};