const { z } = require('zod');

const phoneRegex = /^(09|07)\d{8}$/;

exports.registerSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters long'),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid Ethiopian phone number. Use 09xxxxxxxx or 07xxxxxxxx'),
    email: z.string().email('Please provide a valid email address').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    address: z.string().optional()
});

exports.loginSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    password: z.string().min(1, 'Password is required')
});

exports.verifyOTPschema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    otp: z.string().length(6, 'OTP must be 6 digits')
});

exports.resendOTPSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required')
});

exports.forgotPasswordSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required')
});

exports.resetPasswordSchema = z.object({
    phoneNumber: z.string().min(1, 'Phone number is required'),
    otp: z.string().min(1, 'OTP is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
});
