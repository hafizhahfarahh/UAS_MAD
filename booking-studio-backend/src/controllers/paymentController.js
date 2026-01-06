const db = require("../config/database");

exports.payBooking = (req, res) => {
  const { booking_id, amount, payment_method } = req.body;
  
  if (!booking_id || !amount || !payment_method) {
    return res.status(400).json({ message: "Data pembayaran tidak lengkap" });
  }
  
  // Cek apakah booking ada dan status PENDING
  db.query(
    "SELECT id, status FROM bookings WHERE id = ?",
    [booking_id],
    (err, bookingResult) => {
      if (err || bookingResult.length === 0) {
        return res.status(404).json({ message: "Booking tidak ditemukan" });
      }
      
      if (bookingResult[0].status !== 'PENDING') {
        return res.status(400).json({ 
          message: `Booking sudah dalam status: ${bookingResult[0].status}` 
        });
      }
      
      // Simpan pembayaran
      db.query(
        `INSERT INTO payments (booking_id, amount, payment_method, status)
         VALUES (?, ?, ?, 'SUCCESS')`,
        [booking_id, parseFloat(amount), payment_method],
        (err, paymentResult) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Gagal menyimpan pembayaran" });
          }
          
          // Update status booking
          db.query(
            `UPDATE bookings SET status='PAID' WHERE id=?`,
            [booking_id],
            (err) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ message: "Gagal update status booking" });
              }
              
              res.json({
                message: "Pembayaran berhasil",
                paymentId: paymentResult.insertId,
                status: "PAID"
              });
            }
          );
        }
      );
    }
  );
};