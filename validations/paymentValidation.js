const { z } = require('zod');

exports.submitManualPaymentSchema = z.object({
    groupId: z.string().min(1, 'Group ID is required'),
    amount: z.string().or(z.number()).refine(val => Number(val) > 0, 'Amount must be greater than 0'),
    transactionId: z.string().min(1, 'Transaction ID is required')
});
