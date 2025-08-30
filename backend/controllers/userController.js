// backend/controllers/userController.js
const db = require('../db/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: 'All fields are required' });

    // email unique check
    const [exist] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (exist.length) return res.status(409).json({ msg: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?,?,?)',
      [name, email, hashed]
    );

    const user = { id: result.insertId, name, email };
    res.status(201).json({ msg: 'User registered successfully', user });
  } catch (e) {
    console.error('Signup error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: 'Email and password required' });

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ msg: 'Invalid credentials' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      msg: 'Login successful',
      token,
      user: { id: user.user_id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ msg: 'Server error' });
  }
};
