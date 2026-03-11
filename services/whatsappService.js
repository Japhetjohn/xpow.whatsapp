/**
 * Sends a WhatsApp notification directly via Infobip REST API.
 * @param {string} phone - Recipient's phone number (e.g., +234...)
 * @param {string} message - Notification message.
 * @param {string} link - Redirect link.
 * @returns {Promise<object>} - Infobip message response.
 */
const sendNotification = async (phone, message, link) => {
    // Infobip prefers numbers without the '+' for some reason.
    // We'll strip the '+' and 'whatsapp:' prefix to be safe.
    const cleanPhone = phone.replace('+', '').replace('whatsapp:', '');

    // Format the message with the markdown link
    const formattedMessage = `${message}\n\n[Check it out](${link})`;

    const apiBaseUrl = process.env.INFOBIP_API_BASE_URL;
    const apiKey = process.env.INFOBIP_API_KEY;
    const senderNumber = process.env.INFOBIP_SENDER_NUMBER || '447860099299';

    const url = `https://${apiBaseUrl}/whatsapp/1/message/text`;

    const payload = {
        from: senderNumber,
        to: cleanPhone,
        content: {
            text: formattedMessage
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `App ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Infobip REST Error Response:', data);
            throw new Error(`Infobip Error: ${data.requestError?.serviceException?.text || 'Unknown Error'}`);
        }

        return data;
    } catch (error) {
        console.error('Error sending WhatsApp message via Infobip:', error);
        throw error;
    }
};

module.exports = {
    sendNotification,
};
