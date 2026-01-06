const db = require("../config/database");

exports.createBooking = (req, res) => {
  const userId = req.user.id;
  const { studio_id, date, start_time, end_time } = req.body;
  
  if (!studio_id || !date || !start_time || !end_time) {
    return res.status(400).json({
      message: "Semua data booking harus diisi"
    });
  }
  
  // Cek apakah studio ada
  db.query(
    "SELECT id FROM studios WHERE id = ?",
    [studio_id],
    (err, studioResult) => {
      if (err || studioResult.length === 0) {
        return res.status(404).json({ message: "Studio tidak ditemukan" });
      }
      
      // Cek ketersediaan waktu
      const checkSql = `
        SELECT id FROM bookings 
        WHERE studio_id = ? AND date = ? AND status != 'CANCELLED'
        AND (
          (start_time < ? AND end_time > ?) OR
          (start_time >= ? AND start_time < ?)
        )
      `;
      
      db.query(
        checkSql,
        [studio_id, date, end_time, start_time, start_time, end_time],
        (err, conflictResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
          }
          
          if (conflictResult.length > 0) {
            return res.status(409).json({ 
              message: "Waktu booking bentrok dengan booking lain" 
            });
          }
          
          // Buat booking
          const sql = `
            INSERT INTO bookings (user_id, studio_id, date, start_time, end_time, status)
            VALUES (?, ?, ?, ?, ?, 'PENDING')
          `;
          
          db.query(
            sql,
            [userId, studio_id, date, start_time, end_time],
            (err, result) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Gagal membuat booking" });
              }
              
              res.status(201).json({
                message: "Booking berhasil dibuat",
                bookingId: result.insertId,
                booking: {
                  id: result.insertId,
                  user_id: userId,
                  studio_id,
                  date,
                  start_time,
                  end_time,
                  status: 'PENDING'
                }
              });
            }
          );
        }
      );
    }
  );
};

exports.getMyBookings = (req, res) => {
  const userId = req.user.id;
  
  const sql = `
    SELECT b.*, s.name AS studio_name, s.price
    FROM bookings b
    JOIN studios s ON b.studio_id = s.id
    WHERE b.user_id = ?
    ORDER BY b.date DESC, b.start_time DESC
  `;
  
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mengambil data booking" });
    }
    
    res.json(result);
  });
};

exports.cancelBooking = (req, res) => {
  const userId = req.user.id;
  const { bookingId } = req.params;
  
  db.query(
    "UPDATE bookings SET status = 'CANCELLED' WHERE id = ? AND user_id = ?",
    [bookingId, userId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Gagal membatalkan booking" });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking tidak ditemukan" });
      }
      
      res.json({ message: "Booking berhasil dibatalkan" });
    }
  );
};