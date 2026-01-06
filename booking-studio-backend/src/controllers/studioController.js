const db = require("../config/database");

exports.getStudios = (req, res) => {
  db.query("SELECT id, name, price, description FROM studios ORDER BY name", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data studio" });
    }
    res.json(result);
  });
};

exports.getStudioById = (req, res) => {
  const id = req.params.id;
  
  db.query(
    "SELECT id, name, price, description FROM studios WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "Studio tidak ditemukan" });
      }
      res.json(result[0]);
    }
  );
};

exports.addStudio = (req, res) => {
  const { name, price, description } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ message: "Nama dan harga studio wajib diisi" });
  }
  
  db.query(
    "INSERT INTO studios (name, price, description) VALUES (?, ?, ?)",
    [name, parseFloat(price), description || null],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal menambahkan studio" });
      }
      
      res.status(201).json({
        message: "Studio berhasil ditambahkan",
        studioId: result.insertId,
        studio: {
          id: result.insertId,
          name,
          price,
          description
        }
      });
    }
  );
};