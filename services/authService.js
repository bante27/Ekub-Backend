const User = require('../models/User');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const Blacklist = require('../models/Blacklist');
const { generateToken } = require('../middlewares/authMiddleware');
const AppError = require('../utils/appError');

const pendingUsers = new Map();

const generateUserId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();

const sendSMS = async (phoneNumber, otp) => {
    try {
        let formattedPhone = phoneNumber.startsWith('0') ? '251' + phoneNumber.substring(1) : phoneNumber;
        const response = await axios.get('https://api.afromessage.com/api/send', {
            params: {
                from: process.env.AFRO_IDENTIFIER,
                to: formattedPhone,
                message: `Your Ekub verification code is: ${otp}`,
                sender: 'AfroMessage'
            },
            headers: { 'Authorization': `Bearer ${process.env.AFRO_API_KEY?.trim()}` }
        });
        return response.data.acknowledge === 'success';
    } catch (err) {
        console.error("SMS API ERROR:", err.message);
        return false;
    }
};

class AuthService {
    static async register(data) {
        const { fullName, phoneNumber, password, email, address } = data;
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            throw new AppError('User exists!', 400);
        }

        const otpRaw = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        pendingUsers.set(phoneNumber, {
            userId: generateUserId(),
            fullName, phoneNumber, email, address,
            password: hashedPassword,
            otp: otpRaw,
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        setTimeout(() => pendingUsers.delete(phoneNumber), 5 * 60 * 1000);

        const smsSent = await sendSMS(phoneNumber, otpRaw);
        return { smsSent };
    }

    static async verifyOTP(phoneNumber, otp) {
        const tempUser = pendingUsers.get(phoneNumber);
        if (!tempUser) {
            throw new AppError('Registration not found or expired', 400);
        }

        if (tempUser.otp !== otp) {
            throw new AppError('Incorrect OTP code', 400);
        }

        const newUser = new User({
            userId: tempUser.userId,
            fullName: tempUser.fullName,
            phoneNumber: tempUser.phoneNumber,
            email: tempUser.email,
            address: tempUser.address,
            password: tempUser.password,
            isVerified: true,
            tokenVersion: 0
        });

        await newUser.save();
        pendingUsers.delete(phoneNumber);

        const token = generateToken(newUser._id, newUser.tokenVersion);
        return { token, user: { fullName: newUser.fullName, userId: newUser.userId } };
    }

    static async resendOTP(phoneNumber) {
        const tempUser = pendingUsers.get(phoneNumber);
        if (!tempUser) {
            throw new AppError('No pending registration.', 404);
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        tempUser.otp = newOtp;
        tempUser.expiresAt = Date.now() + 5 * 60 * 1000;

        const smsSent = await sendSMS(phoneNumber, newOtp);
        return { smsSent };
    }

    static async login(phoneNumber, password) {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            throw new AppError('Invalid Credentials', 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AppError('Invalid Credentials', 400);
        }

        user.tokenVersion += 1;
        await user.save();

        const token = generateToken(user._id, user.tokenVersion);
        return { token, user: { userId: user.userId, fullName: user.fullName } };
    }

    static async forgotPassword(phoneNumber) {
        if (!phoneNumber) {
            throw new AppError('Phone number is required', 400);
        }

        const user = await User.findOne({ phoneNumber });
        if (!user) {
            throw new AppError('User not found with this phone number', 404);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const smsSent = await sendSMS(phoneNumber, otp);
        if (!smsSent) {
            throw new AppError('Failed to send SMS. Please try again.', 500);
        }

        return true;
    }

    static async resetPassword(phoneNumber, otp, newPassword) {
        if (!phoneNumber || !otp || !newPassword) {
            throw new AppError('Phone number, OTP, and new password are required', 400);
        }

        if (newPassword.length < 6) {
            throw new AppError('Password must be at least 6 characters long', 400);
        }

        const user = await User.findOne({
            phoneNumber,
            otp: otp,
            otpExpire: { $gt: new Date() }
        });

        if (!user) {
            throw new AppError('Invalid OTP or OTP expired. Please request a new one.', 400);
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpire = undefined;
        user.tokenVersion += 1;

        await user.save();
        return true;
    }

    static async logout(authHeader) {
        const token = authHeader?.split(' ')[1];
        if (token) {
            await Blacklist.create({ token });
        }
        return true;
    }
}

module.exports = AuthService;
