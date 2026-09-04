const cron = require('node-cron');
const Group = require('../models/Group');
const { sendSMS } = require('../utils/notification');

/**
 * Initializes the automated SMS reminder cron job.
 * Runs daily at 09:00 AM server time ('0 9 * * *').
 */
const initReminderJob = () => {
    cron.schedule('0 9 * * *', async () => {
        console.log('🔍 Checking for upcoming payment reminders...');

        try {
            // Set start of today (00:00:00)
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            // Set end of tomorrow (23:59:59)
            const tomorrowEnd = new Date();
            tomorrowEnd.setDate(todayStart.getDate() + 1);
            tomorrowEnd.setHours(23, 59, 59, 999);

            // Query groups with nextDrawDate falling between today and tomorrow
            const upcomingDraws = await Group.find({
                nextDrawDate: { $gte: todayStart, $lte: tomorrowEnd }
            }).populate('members');

            for (const group of upcomingDraws) {
                // Convert activeParticipants array to string representations for safe lookup
                const activeParticipantIds = group.activeParticipants.map(id => id.toString());

                // Filter members who haven't paid yet
                const unpaidMembers = group.members.filter(
                    member => !activeParticipantIds.includes(member._id.toString())
                );

                if (unpaidMembers.length > 0) {
                    const phoneNumbers = unpaidMembers
                        .map(m => m.phoneNumber)
                        .filter(Boolean); // Filter out empty or missing phone numbers

                    if (phoneNumbers.length > 0) {
                        const message = `Urgent Reminder: Please complete your payment today to be included in tomorrow's ${group.name} Equb draw.`;
                        
                        await sendSMS(phoneNumbers, message);
                        console.log(`📱 Sent payment reminder SMS to ${phoneNumbers.length} member(s) in group: ${group.name}`);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Error executing payment reminder job:', error.message);
        }
    });
};

module.exports = initReminderJob;