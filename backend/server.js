const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();


const userRoutes = require('./routes/userRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const authmiddleware = require('./middleware/authmiddleware');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);


const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Public routes (no token required)
app.use('/users', userRoutes);

// ✅ Protected routes (token required)
app.use(authmiddleware);
app.use('/budgets', budgetRoutes);
app.use('/expenses', expenseRoutes);
app.use('/receipts', receiptRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/incomes', incomeRoutes);
app.use('/uploads', express.static(uploadDir));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
