// backend/controllers/expenseController.js
const db = require('../db/db');

exports.addExpense = async (req, res) => {
  try {
    const user_id = req.user.userId; // from JWT
    const {
      category,       // varchar (ex: "Food")
      amount,         // decimal
      description,    // text or varchar
      date,           // 'YYYY-MM-DD'
      source = 'manual', // 'manual' | 'ocr'
      receipt_id = null
    } = req.body;

    if (!amount || !date)
      return res.status(400).json({ msg: 'amount and date are required' });

    // adjust columns list if your table differs
    const [result] = await db.query(
      `INSERT INTO expenses (user_id, category, amount, description, date, source, receipt_id)
       VALUES (?,?,?,?,?,?,?)`,
      [user_id, category || null, amount, description || null, date, source, receipt_id]
    );

    res.status(201).json({ msg: 'Expense added', expenseId: result.insertId });
  } catch (e) {
    console.error('Add expense error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const [rows] = await db.query(
      `SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, expense_id DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('Get expenses error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};
