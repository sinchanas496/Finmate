// backend/models/userModel.js
const pool = require('../db/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function createUser({ name, email, password }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  const [rows] = await pool.query('SELECT user_id AS id, name, email, created_at FROM users WHERE user_id = ?', [result.insertId]);
  return rows[0];
}

async function getAllUsers() {
  const [rows] = await pool.query('SELECT user_id AS id, name, email, created_at FROM users ORDER BY created_at DESC');
  return rows;
}

async function getUserById(id) {
  const [rows] = await pool.query('SELECT user_id AS id, name, email, created_at FROM users WHERE user_id = ?', [id]);
  return rows[0] || null;
}

module.exports = { findUserByEmail, createUser, getAllUsers, getUserById };
