const db = require("../db/db");

function addReceipt(user_id, file_path, extracted_text = null) {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO receipts (user_id, file_path, extracted_text) VALUES (?, ?, ?)";
    db.query(sql, [user_id, file_path, extracted_text], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
}

function getReceipts(user_id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM receipts WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { addReceipt, getReceipts };
