const db = require("../config/database");

exports.addReview = (req, res) => {
  const { booking_id, rating, comment } = req.body;
  
  if (!booking_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ 
      message: "Rating harus antara 1-5 dan booking_id harus diisi" 
    });
  }
  
  // Cek apakah booking ada dan sudah PAID
  db.query(
    `SELECT b.*, u.name AS user_name 
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     WHERE b.id = ?`,
    [booking_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });
      if (result.length === 0) {
        return res.status(404).json({ message: "Booking tidak ditemukan" });
      }
      
      const booking = result[0];
      
      if (booking.status !== 'PAID') {
        return res.status(403).json({
          message: "Hanya bisa review booking yang sudah dibayar"
        });
      }
      
      // Cek apakah sudah pernah review
      db.query(
        "SELECT id FROM reviews WHERE booking_id = ?",
        [booking_id],
        (err, reviewResult) => {
          if (reviewResult.length > 0) {
            return res.status(400).json({ message: "Booking sudah direview" });
          }
          
          // Simpan review
          db.query(
            `INSERT INTO reviews (user_id, studio_id, booking_id, rating, comment)
             VALUES (?, ?, ?, ?, ?)`,
            [booking.user_id, booking.studio_id, booking_id, rating, comment || null],
            (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Gagal menyimpan review" });
              }
              
              res.json({
                message: "Review berhasil ditambahkan"
              });
            }
          );
        }
      );
    }
  );
};

exports.getReviewsByStudio = (req, res) => {
  const { studioId } = req.params;
  
  db.query(
    `SELECT r.rating, r.comment, r.created_at, u.name AS user_name 
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.studio_id = ?
     ORDER BY r.created_at DESC`,
    [studioId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal mengambil review" });
      }
      res.json(result);
    }
  );
};

exports.getStudioRating = (req, res) => {
  const { studioId } = req.params;
  
  db.query(
    `SELECT 
       AVG(rating) as average_rating,
       COUNT(*) as total_reviews
     FROM reviews 
     WHERE studio_id = ?`,
    [studioId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal mengambil rating" });
      }
      res.json(result[0]);
    }
  );
};