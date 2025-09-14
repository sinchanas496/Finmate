const db = require('../db/db');

exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch totals
        const [budgetResult] = await db.query(
            'SELECT IFNULL(SUM(amount), 0) AS total_budget FROM budgets WHERE user_id = ?',
            [userId]
        );

        const [expenseResult] = await db.query(
            'SELECT IFNULL(SUM(amount), 0) AS total_expenses FROM expenses WHERE user_id = ?',
            [userId]
        );

        const [receiptResult] = await db.query(
            'SELECT COUNT(*) AS total_receipts FROM receipts WHERE user_id = ?',
            [userId]
        );

        const totalBudget = budgetResult[0].total_budget;
        const totalExpenses = expenseResult[0].total_expenses;
        const totalReceipts = receiptResult[0].total_receipts;
        const remainingBudget = totalBudget - totalExpenses;

        res.json({
            success: true,
            data: {
                total_budget: totalBudget,
                total_expenses: totalExpenses,
                remaining_budget: remainingBudget,
                total_receipts: totalReceipts
            }
        });
    } catch (error) {
        console.error('❌ Dashboard error:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
