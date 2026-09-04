const Group = require('../models/Group');
const crypto = require('crypto');
const AppError = require('../utils/appError');

class GroupService {
    static async createGroup(userId, data) {
        const { name, amount, frequency, maxMembers } = data;
        const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        const newGroup = new Group({
            name,
            amount,
            frequency,
            maxMembers,
            admin: userId,
            members: [userId],
            inviteCode
        });

        await newGroup.save();

        return {
            group: newGroup,
            inviteLink: `https://yourapp.com/join-ekub?code=${inviteCode}`
        };
    }

    static async joinGroup(userId, inviteCode) {
        const group = await Group.findOne({ inviteCode });
        if (!group) {
            throw new AppError('Invalid Invite Code', 404);
        }

        if (group.members.length >= group.maxMembers) {
            throw new AppError('Group is full', 400);
        }

        if (group.members.includes(userId)) {
            throw new AppError('You are already in this Ekub', 400);
        }

        group.members.push(userId);
        await group.save();
        return group;
    }

    static async getGroupDetails(groupId) {
        const group = await Group.findById(groupId).populate('members', 'fullName phoneNumber');
        if (!group) {
            throw new AppError('Group not found', 404);
        }
        return group;
    }

    static async getMyGroups(userId) {
        const groups = await Group.find({ members: userId });
        return groups;
    }

    static async getWinnerHistory(groupId) {
        if (!groupId || groupId === 'undefined') {
            throw new AppError('Invalid Group ID provided', 400);
        }

        const group = await Group.findById(groupId).populate({
            path: 'winnersHistory.user',
            select: 'fullName phoneNumber'
        });

        if (!group) {
            throw new AppError('Group not found', 404);
        }

        return group.winnersHistory || [];
    }

    static async getMyWinningHistory(userId) {
        const groups = await Group.find({ 'winnersHistory.user': userId }).select('name winnersHistory');

        const myWins = groups.map(group => {
            const personalWins = group.winnersHistory.filter(win =>
                win.user && win.user.toString() === userId.toString()
            );

            return {
                groupName: group.name,
                wins: personalWins
            };
        }).filter(item => item.wins.length > 0);

        return myWins;
    }
}

module.exports = GroupService;
