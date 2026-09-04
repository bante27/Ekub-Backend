const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// 1. Load environment variables FIRST
dotenv.config();

// 2. Connect to Database
connectDB();

// 3. Import logic (Security and Jobs)
const { applySecurity } = require('./middlewares/security');

// Ensure the reminder job file is correctly located in the jobs folder
const initReminderJob = require('./jobs/reminderJob');

const app = express();

// --- 🛡️ 1. APPLY SECURITY ---
applySecurity(app);

// --- ⏰ 2. START CRON JOBS ---
initReminderJob(); 

// --- 📦 3. BODY PARSER ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 📂 4. STATIC FOLDER ---


// --- 🛣️ 5. ROUTES ---
app.use('/api/v1/contact', require('./routes/contactRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/user', require('./routes/userRoutes')); 
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/groups', require('./routes/groupRoutes'));
app.use('/api/v1/transaction', require('./routes/transactionRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Secure Server running on port ${PORT}`));