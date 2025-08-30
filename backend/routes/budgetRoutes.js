// backend/routes/budgetRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const { addBudget, getBudgets } = require('../controllers/budgetController');

router.post('/', auth, addBudget);
router.get('/', auth, getBudgets);

module.exports = router;
