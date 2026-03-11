/**
 * Sends a WhatsApp notification directly via Twilio REST API using fetch.
 * @param {string} phone - Recipient's phone number (must be E.164 string like +234...)
 * @param {string} message - Notification message.
 * @param {string} link - Redirect link.
 * @returns {Promise<object>} - Twilio message response containing the SID.
 */
const sendNotification = async (phone, message, link) => {
    // Format the message with the markdown link as in our test script
    const formattedMessage = `${message}\n\n[Check it out](${link})`;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    // Twilio requires the whatsapp: prefix for WhatsApp messages
    const toNumber = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const params = new URLSearchParams();
    params.append('To', toNumber);
    params.append('From', fromNumber);
    params.append('Body', formattedMessage);

    try {
        const response = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Twilio REST Error Response:', data);
            throw new Error(`Twilio Error ${data.status}: ${data.message}`);
        }

        return data; // returns the message payload which includes the sid
    } catch (error) {
        console.error('Error sending WhatsApp message via native fetch:', error);
        throw error;
    }
};

module.exports = {
    sendNotification,
};
