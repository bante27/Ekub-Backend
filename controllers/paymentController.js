const PaymentService = require('../services/paymentService');
const catchAsync = require('../utils/catchAsync');

exports.submitManualPayment = catchAsync(async (req, res) => {
  const newTransaction = await PaymentService.submitManualPayment(req.user._id, req.file, req.body);
  res.status(201).json({ success: true, msg: "Receipt submitted successfully.", data: newTransaction });
});

exports.getUserTransactions = catchAsync(async (req, res) => {
  const transactions = await PaymentService.getUserTransactions(req.user._id);
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

exports.getGroupTransactions = catchAsync(async (req, res) => {
  const transactions = await PaymentService.getGroupTransactions(req.params.groupId);
  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});
