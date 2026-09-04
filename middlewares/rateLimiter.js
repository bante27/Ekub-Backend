const rateLimit = require('express-rate-limit');

// 🛡️ General Limiter: Prevent spamming any auth route
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 10 requests per window
    message: {
        success: false,
        msg: "Too many attempts from this IP, please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 📱 SMS/OTP Limiter: Very strict to save you money on AfroMessage
exports.otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Only 5 OTP requests allowed per hour
    message: {
        success: false,
        msg: "Too many OTP requests. Please wait an hour before trying again."
    }
});