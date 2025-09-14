const db = require('../db/db');

// Add income
exports.addIncome = async (req, res) => {
  try {
    const { source, amount, date, description } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "Source, amount, and date are required" });
    }

    await db.query(
  `INSERT INTO income (user_id, source, amount, date, description)
   VALUES (?, ?, ?, ?, ?)`,
  [req.user.id, source, amount, date, description || null]  // use req.user.id
);


    res.status(201).json({ success: true, message: "Income added successfully" });
  } catch (error) {
    console.error("❌ Income add error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all incomes
exports.getIncomes = async (req, res) => {
  try {
    const [incomes] = await db.query(
  `SELECT * FROM income WHERE user_id = ? ORDER BY date DESC`,
  [req.user.id]  // use req.user.id
);


    res.json({ success: true, data: incomes });
  } catch (error) {
    console.error("❌ Fetch incomes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
