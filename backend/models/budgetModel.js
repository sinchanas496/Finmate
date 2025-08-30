const db = require("../db/db");

function setBudget(user_id, category, limit_amount, start_date, end_date) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO budgets (user_id, category, limit_amount, start_date, end_date)
                 VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [user_id, category, limit_amount, start_date, end_date], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
}

function getBudgets(user_id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM budgets WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { setBudget, getBudgets };
