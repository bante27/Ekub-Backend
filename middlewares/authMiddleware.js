const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.generateToken = (id, tokenVersion) => {
    return jwt.sign({ id, tokenVersion }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized, no token provided', 401));
    }

    const isBlacklisted = await Blacklist.findOne({ token });
    if (isBlacklisted) {
        return next(new AppError('Token invalid. Please login again.', 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return next(new AppError('Not authorized, token failed', 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('User no longer exists.', 401));
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
        return next(new AppError('New login detected elsewhere. This session is now invalid.', 401));
    }

    req.user = user._id;
    next();
});
