// backend/routes/expenseRoutes.js
const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/authmiddleware'); // protect routes

router.post('/', auth, expenseController.createExpense);
router.get('/', auth, expenseController.getExpenses);

module.exports = router;
