const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/authmiddleware');

// Protected routes
router.post('/', authmiddleware, budgetController.createBudget);
router.get('/', authmiddleware, budgetController.getBudgets);
router.delete('/:id', authmiddleware, budgetController.deleteBudget);

module.exports = router;
