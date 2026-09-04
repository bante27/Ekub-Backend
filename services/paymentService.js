const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const crypto = require('crypto');
const mongoose = require('mongoose');
const AppError = require('../utils/appError');

class PaymentService {
    static async submitManualPayment(userId, file, body) {
        const { groupId, amount, transactionId } = body;

        if (!file) {
            throw new AppError('Please upload a receipt image', 400);
        }

        if (!groupId || !mongoose.Types.ObjectId.isValid(groupId)) {
            throw new AppError('Invalid Ekub ID selected', 400);
        }

        const groupExists = await Group.findById(groupId);
        if (!groupExists) {
            throw new AppError('Ekub not found', 404);
        }

        const internalRef = `EKUB-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

        try {
            const newTransaction = await Transaction.create({
                user: userId,
                group: groupId,
                amount: Number(amount),
                transactionId,
                tx_ref: internalRef,
                receiptImage: file.path,
                status: 'pending'
            });
            return newTransaction;
        } catch (err) {
            if (err.code === 11000) {
                throw new AppError('This transaction reference number has already been registered.', 400);
            }
            throw err;
        }
    }

    static async getUserTransactions(userId) {
        const transactions = await Transaction.find({ user: userId })
            .populate('group', 'name amount')
            .sort({ createdAt: -1 });
        return transactions;
    }

    static async getGroupTransactions(groupId) {
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            throw new AppError('Invalid Group ID', 400);
        }

        const transactions = await Transaction.find({ group: groupId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        return transactions;
    }
}

module.exports = PaymentService;
