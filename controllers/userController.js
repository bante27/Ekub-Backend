const UserService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

exports.getMe = catchAsync(async (req, res) => {
  const user = await UserService.getMe(req.user);
  res.json({ success: true, data: user });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const user = await UserService.updateProfile(req.user, req.body);
  res.json({ success: true, msg: "Profile updated!", user });
});

exports.submitKYC = catchAsync(async (req, res) => {
  const user = await UserService.submitKYC(req.user, req.file, req.body);
  res.json({ success: true, msg: "KYC submitted", status: user.kycStatus });
});
