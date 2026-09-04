const AuthService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res) => {
    const result = await AuthService.register(req.body);
    res.status(201).json({ success: true, msg: result.smsSent ? 'OTP sent!' : 'SMS Failed.' });
});

exports.verifyOTP = catchAsync(async (req, res) => {
    const result = await AuthService.verifyOTP(req.body.phoneNumber, req.body.otp);
    res.status(200).json({ success: true, token: result.token, user: result.user });
});

exports.resendOTP = catchAsync(async (req, res) => {
    const result = await AuthService.resendOTP(req.body.phoneNumber);
    res.status(200).json({ success: true, msg: result.smsSent ? 'OTP Resent!' : 'SMS Failed.' });
});

exports.login = catchAsync(async (req, res) => {
    const result = await AuthService.login(req.body.phoneNumber, req.body.password);
    res.json({ success: true, token: result.token, user: result.user });
});

exports.forgotPassword = catchAsync(async (req, res) => {
    await AuthService.forgotPassword(req.body.phoneNumber);
    res.status(200).json({ success: true, msg: 'Password reset OTP sent successfully!' });
});

exports.resetPassword = catchAsync(async (req, res) => {
    await AuthService.resetPassword(req.body.phoneNumber, req.body.otp, req.body.newPassword);
    res.status(200).json({ success: true, msg: 'Password updated successfully! You can now login with your new password.' });
});

exports.logout = catchAsync(async (req, res) => {
    await AuthService.logout(req.headers.authorization);
    res.status(200).json({ success: true, msg: 'Logged out.' });
});
