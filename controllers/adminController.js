const AdminService = require('../services/adminService');
const catchAsync = require('../utils/catchAsync');

exports.approvePayment = catchAsync(async (req, res) => {
  await AdminService.approvePayment(req.body.transactionId);
  res.status(200).json({ success: true, msg: "Payment approved!" });
});

exports.generateWinner = catchAsync(async (req, res) => {
  const winnerName = await AdminService.generateWinner(req.params.groupId);
  res.status(200).json({
    success: true,
    winner: winnerName,
    msg: "Winner drawn and notifications sent successfully."
  });
});

exports.getPendingPayments = catchAsync(async (req, res) => {
  const pendingPayments = await AdminService.getPendingPayments();
  res.status(200).json({ success: true, data: pendingPayments });
});

exports.getPendingKYC = catchAsync(async (req, res) => {
  const pendingUsers = await AdminService.getPendingKYC();
  res.status(200).json({ success: true, count: pendingUsers.length, data: pendingUsers });
});

exports.verifyUserKYC = catchAsync(async (req, res) => {
  const { userId, status, reason } = req.body;
  await AdminService.verifyUserKYC(userId, status, reason);
  res.status(200).json({ success: true, msg: "KYC Status Updated" });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await AdminService.deleteUser(req.params.id);
  res.status(200).json({ success: true, msg: "User deleted" });
});
