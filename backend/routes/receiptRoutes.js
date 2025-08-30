// backend/routes/receiptRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authmiddleware');
const { uploadReceipt, getReceipts } = require('../controllers/receiptController');

router.post('/', auth, uploadReceipt);
router.get('/', auth, getReceipts);

module.exports = router;
