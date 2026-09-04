const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    amount: { type: Number, required: true },
    // transactionId = The bank's reference number (from the user)
    transactionId: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    // tx_ref = Internal unique reference (solves the E11000 error)
    tx_ref: {
        type: String,
        unique: true
    },
    receiptImage: { type: String, required: true }, 
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    }
}, { timestamps: true });

// Forces Mongoose to sync indexes
TransactionSchema.set('autoIndex', true); 

module.exports = mongoose.model('Transaction', TransactionSchema);