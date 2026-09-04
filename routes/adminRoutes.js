const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware'); 

const { 
    getPendingKYC, 
    verifyUserKYC, 
    deleteUser, 
    approvePayment, 
    getPendingPayments,
    generateWinner,
} = require('../controllers/adminController');



// --- 🆔 KYC Management ---
router.get('/kyc/pending', protect, adminOnly, getPendingKYC);
router.post('/kyc/verify', protect, adminOnly, verifyUserKYC);

// --- 💰 Payment Management ---
router.get('/payments/pending', protect, adminOnly, getPendingPayments);
router.put('/payments/approve', protect, adminOnly, approvePayment);

// --- 🎲 Ekub Draw (Etal) & Cycle ---
router.post('/draw/:groupId', protect, adminOnly, generateWinner);

// --- 👤 User Management ---
router.delete('/user/:id', protect, adminOnly, deleteUser);

module.exports = router;