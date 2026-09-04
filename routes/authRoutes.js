const express = require('express');
const router = express.Router();
const { 
    register, 
    verifyOTP, 
    login, 
    resendOTP, 
    logout,
    forgotPassword, 
    resetPassword  
} = require('../controllers/authController');

const { protect } = require('../middlewares/authMiddleware');
const { authLimiter, otpLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validator');
const { 
    registerSchema, 
    loginSchema, 
    verifyOTPschema, 
    resendOTPSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema 
} = require('../validations/authValidation');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/verify-otp', authLimiter, validate(verifyOTPschema), verifyOTP);
router.post('/resend-otp', otpLimiter, validate(resendOTPSchema), resendOTP);

router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword); 
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

router.get('/logout', protect, logout); 

module.exports = router;
