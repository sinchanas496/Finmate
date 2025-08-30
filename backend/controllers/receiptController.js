// backend/controllers/receiptController.js
const db = require('../db/db');

// Simple metadata save; plug OCR later.
exports.uploadReceipt = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { file_path, extracted_text = null } = req.body;
    if (!file_path) return res.status(400).json({ msg: 'file_path is required' });

    const [result] = await db.query(
      `INSERT INTO receipts (user_id, file_path, extracted_text, processed)
       VALUES (?,?,?,?)`,
      [user_id, file_path, extracted_text, extracted_text ? 1 : 0]
    );

    res.status(201).json({ msg: 'Receipt saved', receiptId: result.insertId });
  } catch (e) {
    console.error('Upload receipt error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const [rows] = await db.query(
      `SELECT * FROM receipts WHERE user_id = ? ORDER BY uploaded_at DESC, receipt_id DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('Get receipts error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};
