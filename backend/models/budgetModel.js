const db = require('../db/db');

// Create budget
exports.createBudget = async (userId, category, limit_amount, start_date, end_date) => {
    await db.query(
        'INSERT INTO budgets (user_id, category, limit_amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
        [userId, category, limit_amount, start_date, end_date]
    );
};

// Get budgets
exports.getBudgets = async (userId) => {
    const [budgets] = await db.query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
    return budgets;
};
