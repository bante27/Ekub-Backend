const User = require('../models/User');
const AppError = require('../utils/appError');

class UserService {
    static async getMe(userId) {
        const user = await User.findById(userId).select('-password -otp -otpExpire');
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user;
    }

    static async updateProfile(userId, body) {
        const { address, occupation, dateOfBirth } = body;
        const user = await User.findByIdAndUpdate(
            userId,
            { address, occupation, dateOfBirth },
            { new: true, runValidators: true }
        ).select('-password');
        return user;
    }

    static async submitKYC(userId, file, body) {
        if (!file) {
            throw new AppError('Please upload an ID image', 400);
        }

        const { idType, idNumber } = body;
        const updateData = {
            idType,
            idNumber,
            idImage: file.path,
            kycStatus: 'pending',
            rejectionReason: ""
        };

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        return user;
    }
}

module.exports = UserService;
