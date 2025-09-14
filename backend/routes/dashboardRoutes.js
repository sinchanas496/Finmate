const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Protected dashboard route
router.get('/', dashboardController.getDashboard);

module.exports = router;
