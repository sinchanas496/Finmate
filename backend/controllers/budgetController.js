// backend/controllers/budgetController.js
const db = require('../db/db');

exports.addBudget = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { category, limit_amount, start_date, end_date } = req.body;

    if (!category || !limit_amount || !start_date || !end_date) {
      return res.status(400).json({ msg: 'category, limit_amount, start_date, end_date are required' });
    }

    const [result] = await db.query(
      `INSERT INTO budgets (user_id, category, limit_amount, start_date, end_date)
       VALUES (?,?,?,?,?)`,
      [user_id, category, limit_amount, start_date, end_date]
    );

    res.status(201).json({ msg: 'Budget added', budgetId: result.insertId });
  } catch (e) {
    console.error('Add budget error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const [rows] = await db.query(
      `SELECT * FROM budgets WHERE user_id = ? ORDER BY start_date DESC, budget_id DESC`,
      [user_id]
    );
    res.json(rows);
  } catch (e) {
    console.error('Get budgets error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};
