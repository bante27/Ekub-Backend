const axios = require('axios');

const sendSMS = async (phoneNumbers, message) => {
    try {
        const phoneArray = Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers];

        const formattedPhones = phoneArray.map(phone => {
            let p = phone.trim();
            if (p.startsWith('0')) return '251' + p.substring(1);
            if (p.startsWith('+')) return p.substring(1);
            return p;
        });

        // Track success count
        let successCount = 0;

        // Send one by one to avoid rate limits or delivery issues
        for (const phone of formattedPhones) {
            try {
                const response = await axios.post('https://api.afromessage.com/api/send', {
                    to: phone, // Single phone number
                    message: message,
                    from: process.env.AFRO_IDENTIFIER,
                    sender: 'AfroMessage'
                }, {
                    headers: { 
                        'Authorization': `Bearer ${process.env.AFRO_API_KEY?.trim()}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.acknowledge === 'success') {
                    successCount++;
                    console.log(`✅ SMS sent to ${phone}`);
                } else {
                    console.log(`⚠️ SMS not sent to ${phone}:`, response.data.response?.errors || response.data.acknowledge);
                }
            } catch (singleErr) {
                console.error(`❌ Error for ${phone}:`, singleErr.response?.data?.response?.errors || singleErr.message);
            }
        }

        return successCount > 0;

    } catch (err) {
        console.error("❌ SMS API Global Error:", err.message);
        return false;
    }
};

module.exports = { sendSMS };