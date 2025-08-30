const db = require("../db/db");

function addExpense(user_id, category, amount, description, date, source = "manual", receipt_id = null) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO expenses (user_id, category, amount, description, date, source, receipt_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [user_id, category, amount, description, date, source, receipt_id], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
}

function getExpenses(user_id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM expenses WHERE user_id = ?", [user_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = { addExpense, getExpenses };
