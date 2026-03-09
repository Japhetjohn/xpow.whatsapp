const { client, whatsappNumber } = require('../config/twilio');

/**
 * Sends a WhatsApp notification using Twilio.
 * @param {string} phone - Recipient's phone number.
 * @param {string} message - Notification message.
 * @param {string} link - Redirect link.
 * @returns {Promise<object>} - Twilio message response.
 */
const sendNotification = async (phone, message, link) => {
    const formattedMessage = `🚀 XPOW Notification\n\n${message}\n\nOpen App:\n${link}`;

    try {
        const response = await client.messages.create({
            from: `whatsapp:${whatsappNumber}`,
            to: `whatsapp:${phone}`,
            body: formattedMessage,
        });
        return response;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

module.exports = {
    sendNotification,
};
