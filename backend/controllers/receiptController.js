// controllers/receiptController.js
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const Receipt = require('../models/receiptModel');

// Ensure uploads folder exists (extra safety)
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage pointing to uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Helper to normalize numbers
const normalizeNumber = (s) => {
  if (!s) return null;
  const cleaned = String(s).replace(/[,₹Rs\s]/g, '').replace(/[^\d.]/g, '');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n.toFixed(2) : null;
};

// Exported middleware chain: multer -> handler
exports.uploadReceipt = [
  upload.single('file'),
  async (req, res) => {
    try {
      console.log('⤴️ uploadReceipt called', { file: req.file && req.file.filename, body: req.body, user: req.user });

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'File is required' });
      }

      // Robust user id extraction (support both id and userId)
      const userId = req.user && (req.user.id || req.user.userId);
      if (!userId) {
        return res.status(401).json({ success: false, message: 'User not identified in token' });
      }

      // Build public file path saved to DB: '/uploads/<filename>'
      const filename = req.file.filename; // multer set
      const fileUrl = `/uploads/${filename}`; // this will be served by app.use('/uploads', ...)
      const fullFilePath = req.file.path; // local fs path

      // Run OCR using Tesseract
      const { data: { text } } = await Tesseract.recognize(fullFilePath, 'eng');
      const extractedText = (text || '').replace(/\r/g, '\n').trim();
      console.log('📝 OCR text length:', extractedText.length);

      // Lines for vendor detection
      const lines = extractedText.split('\n').map(l => l.trim()).filter(Boolean);

      // Vendor: prefer form value else first non-empty line
      const vendorFromBody = req.body.vendor && req.body.vendor.trim();
      let parsedVendor = vendorFromBody || (lines.length ? lines[0] : null);
      if (parsedVendor && parsedVendor.length > 120) parsedVendor = parsedVendor.slice(0, 120);

      // Amount: prefer form value else try labeled 'Total' or largest decimal
      let parsedAmount = req.body.amount && String(req.body.amount).trim();
      if (!parsedAmount) {
        const totalRegex = /(?:total|grand total|net total|amount|balance due|balance)\s*[:\-]?\s*(?:₹|rs\.?|inr)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i;
        const m = extractedText.match(totalRegex);
        if (m && m[1]) parsedAmount = m[1];

        if (!parsedAmount) {
          const allNums = extractedText.match(/([0-9]{1,3}(?:[,][0-9]{3})*(?:\.[0-9]{1,2})?)/g);
          if (allNums && allNums.length) {
            const nums = allNums.map(s => parseFloat(s.replace(/,/g, ''))).filter(n => !isNaN(n));
            if (nums.length) {
              parsedAmount = String(Math.max(...nums).toFixed(2));
            }
          }
        }
      }
      parsedAmount = normalizeNumber(parsedAmount);

      // Date: prefer form value else detect common formats
      const dateFromBody = req.body.receipt_date && req.body.receipt_date.trim();
      let parsedDate = dateFromBody || null;
      if (!parsedDate) {
        const dateRegexes = [
          /\d{4}[\/\-]\d{2}[\/\-]\d{2}/,   // 2025-09-11
          /\d{2}[\/\-]\d{2}[\/\-]\d{4}/,   // 11/09/2025
          /\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s\d{4}/i // 5 Sep 2025
        ];
        for (const r of dateRegexes) {
          const dm = extractedText.match(r);
          if (dm) { parsedDate = dm[0]; break; }
        }
      }

      // Category: keyword heuristic (extend as needed)
      const bodyCategory = req.body.category && req.body.category.trim();
      let parsedCategory = bodyCategory || 'Other';
      const lc = extractedText.toLowerCase();
      if (/grocery|supermarket|mart|dmart|big ?bazaar|reliance/i.test(lc)) parsedCategory = 'Groceries';
      else if (/restaurant|cafe|hotel|dine|pizza|dominos|kfc/i.test(lc)) parsedCategory = 'Food & Dining';
      else if (/uber|ola|taxi|cab|bus|train|metro/i.test(lc)) parsedCategory = 'Transport';
      else if (/pharmacy|clinic|hospital|chemist/i.test(lc)) parsedCategory = 'Healthcare';
      else if (/electronics|flipkart|amazon|myntra|ajio/i.test(lc)) parsedCategory = 'Shopping';
      else if (/bill|electricity|water|broadband|internet|recharge|subscription/i.test(lc)) parsedCategory = 'Bills';

      // Save to DB (store fileUrl for serving to frontend)
      const insertedId = await Receipt.createReceipt(
        userId,
        fileUrl,          // store '/uploads/filename' so frontend can GET it
        extractedText,    // full OCR text
        parsedAmount,
        parsedVendor,
        parsedCategory,
        parsedDate,
        1                 // processed = 1
      );

      return res.status(201).json({
        success: true,
        message: 'Receipt uploaded and processed',
        receipt_id: insertedId,
        parsed: { vendor: parsedVendor, amount: parsedAmount, receipt_date: parsedDate, category: parsedCategory }
      });
    } catch (err) {
      console.error('❌ uploadReceipt error:', err);
      return res.status(500).json({ success: false, message: 'Server error during upload' });
    }
  }
];

// GET list
exports.getReceipts = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user.userId);
    if (!userId) return res.status(401).json({ success: false, message: 'User not identified' });

    const rows = await Receipt.getReceiptsByUser(userId);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ getReceipts error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
