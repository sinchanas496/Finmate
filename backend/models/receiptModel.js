// models/receiptModel.js
const db = require('../db/db');

exports.createReceipt = async (
  userId,
  filePath,
  extractedText = null,
  amount = null,
  vendor = null,
  category = null,
  receiptDate = null,
  processed = 0
) => {
  const [result] = await db.query(
    `INSERT INTO receipts 
      (user_id, file_path, extracted_text, amount, vendor, category, receipt_date, processed, uploaded_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [userId, filePath, extractedText, amount, vendor, category, receiptDate, processed]
  );
  return result.insertId;
};

exports.getReceiptsByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT receipt_id, user_id, file_path, extracted_text, amount, vendor, category, receipt_date, processed, uploaded_at
     FROM receipts WHERE user_id = ? ORDER BY uploaded_at DESC`,
    [userId]
  );
  return rows;
};
