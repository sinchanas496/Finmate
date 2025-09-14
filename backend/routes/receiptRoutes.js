// routes/receiptRoutes.js
const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

// upload (note: uploadReceipt is an array [multer, handler])
router.post('/upload', receiptController.uploadReceipt);

// get
router.get('/', receiptController.getReceipts);

module.exports = router;
