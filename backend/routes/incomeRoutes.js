const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const authmiddleware = require('../middleware/authmiddleware'); 

// Protect routes
router.post('/add', authmiddleware, incomeController.addIncome);
router.get('/', authmiddleware, incomeController.getIncomes);

module.exports = router;
