const db = require('../db/db');

// Create budget
exports.createBudget = async (req, res) => {
    try {
        const { category, limit_amount, start_date, end_date } = req.body;

        if (!category || !limit_amount || !start_date || !end_date) {
            return res.status(400).json({
                message: 'All fields required (category, limit_amount, start_date, end_date)'
            });
        }

        await db.query(
            'INSERT INTO budgets (user_id, category, limit_amount, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, category, limit_amount, start_date, end_date]
        );

        res.status(201).json({ success: true, message: 'Budget created' });
    } catch (error) {
        console.error('❌ Budget error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const userId = req.user.id;  // Correct way to get logged-in user id

        const [rows] = await db.query(
            `SELECT 
                b.budget_id,
                b.category,
                b.limit_amount,
                b.start_date,
                b.end_date,
                (SELECT IFNULL(SUM(i.amount), 0)
                 FROM income i
                 WHERE i.user_id = b.user_id
                   AND i.date BETWEEN b.start_date AND b.end_date) AS total_income,
                (SELECT IFNULL(SUM(e.amount), 0)
                 FROM expenses e
                 WHERE e.user_id = b.user_id
                   AND e.category = b.category
                   AND e.date BETWEEN b.start_date AND b.end_date) AS total_expense
             FROM budgets b
             WHERE b.user_id = ?`,
            [userId]
        );

        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ Budget fetch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if budget exists and belongs to the user
        const [budget] = await db.query(
            'SELECT * FROM budgets WHERE budget_id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (budget.length === 0) {
            return res.status(404).json({ message: "Budget not found" });
        }

        await db.query(
            'DELETE FROM budgets WHERE budget_id = ? AND user_id = ?',
            [id, req.user.id]
        );

        res.json({ success: true, message: "Budget deleted" });
    } catch (error) {
        console.error("❌ Budget delete error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

