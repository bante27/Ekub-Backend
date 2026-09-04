const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Group = require('../models/Group');
const { sendSMS } = require('../utils/notification');
const AppError = require('../utils/appError');

class AdminService {
    static async approvePayment(transactionId) {
        const txn = await Transaction.findById(transactionId).populate('user');
        if (!txn) {
            throw new AppError('Transaction not found', 404);
        }

        txn.status = 'approved';
        await txn.save();

        await Group.findByIdAndUpdate(txn.group, {
            $addToSet: { activeParticipants: txn.user._id }
        });

        await sendSMS(txn.user.phoneNumber, `Hello ${txn.user.fullName}, your payment has been approved and you have been included in the draw.`);
        return true;
    }

    static async generateWinner(groupId) {
        const group = await Group.findById(groupId)
            .populate({
                path: 'members',
                select: 'phoneNumber fullName'
            })
            .populate({
                path: 'activeParticipants',
                select: 'phoneNumber fullName'
            });

        if (!group) {
            throw new AppError('Group not found', 404);
        }

        if (group.status === 'completed' && group.activeParticipants.length > 0) {
            group.status = 'started';
        }

        if (!group.activeParticipants || group.activeParticipants.length === 0) {
            throw new AppError('At least one active participant who has paid is required to draw a winner!', 400);
        }

        const winner = group.activeParticipants[Math.floor(Math.random() * group.activeParticipants.length)];

        const allPhones = group.members
            .filter(m => m && m.phoneNumber)
            .map(m => m.phoneNumber);

        if (allPhones.length > 0) {
            const winMsg = `Congratulations! The winner of this round's Ekub is ${winner.fullName}.`;
            await sendSMS(allPhones, winMsg);
        }

        group.winnersHistory.push({ 
            user: winner._id, 
            round: group.winnersHistory.length + 1, 
            wonAt: new Date() 
        });

        if (group.winnersHistory.length >= group.maxMembers) {
            group.status = 'completed';
        }

        group.activeParticipants = [];
        await group.save();

        return winner.fullName;
    }

    static async getPendingPayments() {
        const pendingPayments = await Transaction.find({ status: 'pending' })
            .populate('user', 'fullName phoneNumber')
            .populate('group', 'name amount')
            .sort({ createdAt: -1 });
        return pendingPayments;
    }

    static async getPendingKYC() {
        const pendingUsers = await User.find({ kycStatus: 'pending' })
            .select('-password -otp -tokenVersion') 
            .sort({ updatedAt: -1 });
        return pendingUsers;
    }

    static async verifyUserKYC(userId, status, reason) {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found.', 404);
        }

        if (status === 'rejected') {
            user.kycStatus = 'rejected';
            user.rejectionReason = reason;
        } else {
            user.kycStatus = 'verified';
            user.rejectionReason = undefined; 
        }

        user.tokenVersion += 1; 
        await user.save();
        return true;
    }

    static async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return true;
    }
}

module.exports = AdminService;
