// backend/models/expenseModel.js
const db = require('../db/db');

// Insert expense
exports.create = async (userId, category, amount, description) => {
  return await db.query(
    `INSERT INTO expenses (user_id, category, amount, description) 
     VALUES (?, ?, ?, ?)`,
    [userId, category, amount, description || null]
  );
};

// Fetch expenses by user
exports.findByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT expense_id, category, amount, description, date, source, receipt_id, created_at 
     FROM expenses WHERE user_id = ? ORDER BY date DESC`,
    [userId]
  );
  return rows;
};
