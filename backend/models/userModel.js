const db = require('../db/db');

// Find user by email
exports.findByEmail = async (email) => {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
};

// Create new user
exports.createUser = async (name, email, password) => {
    const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );
    return result.insertId; // return new user's ID
};

// Get all users
exports.getAll = async () => {
    const [users] = await db.query(
        'SELECT user_id, name, email, created_at FROM users ORDER BY created_at DESC'
    );
    return users;
};
