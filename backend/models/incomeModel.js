const db = require('../db/db');

class Income {
  // Create new income
  static async create(userId, source, amount, date, description) {
    try {
      const [result] = await db.query(
        `INSERT INTO income (user_id, source, amount, date, description)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, source, amount, date, description]
      );
      return result.insertId;
    } catch (error) {
      console.error('❌ Income create error:', error);
      throw error;
    }
  }

  // Get all incomes for a user
  static async findByUser(userId) {
    try {
      const [rows] = await db.query(
        'SELECT * FROM income WHERE user_id = ? ORDER BY date DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('❌ Income fetch error:', error);
      throw error;
    }
  }

  // (Optional) Delete income by id
  static async delete(incomeId, userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM income WHERE income_id = ? AND user_id = ?',
        [incomeId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('❌ Income delete error:', error);
      throw error;
    }
  }
}

module.exports = Income;
