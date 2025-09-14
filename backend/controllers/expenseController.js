// backend/controllers/expenseController.js
const Expense = require('../models/expenseModel');

// Create expense
exports.createExpense = async (req, res) => {
  try {
    const { category, amount, description } = req.body;
    if (!category || !amount) {
      return res.status(400).json({ message: 'Category and amount required' });
    }

    await Expense.create(req.user.id, category, amount, description);
    res.status(201).json({ success: true, message: 'Expense added' });
  } catch (error) {
    console.error('❌ Expense error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findByUser(req.user.id);
    res.json({ success: true, data: expenses });
  } catch (error) {
    console.error('❌ Fetch expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
