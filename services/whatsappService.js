/**
 * Sends a WhatsApp notification via Infobip.
 * Supports both raw text and predefined templates.
 * 
 * @param {object} params - Notification parameters.
 * @param {string} params.phone - Recipient phone (e.g., +234...)
 * @param {string} [params.message] - Raw text message.
 * @param {string} [params.templateName] - Name of the WhatsApp template.
 * @param {Array} [params.templatePlaceholders] - Values for {{1}}, {{2}}, etc.
 * @returns {Promise<object>} - Infobip response.
 */
const sendNotification = async ({ phone, message, templateName, templatePlaceholders = [] }) => {
    const cleanPhone = phone.replace('+', '').replace('whatsapp:', '');
    const apiBaseUrl = process.env.INFOBIP_API_BASE_URL;
    const apiKey = process.env.INFOBIP_API_KEY;
    const senderNumber = process.env.INFOBIP_SENDER_NUMBER;

    let url, payload;

    if (templateName) {
        // Template Message Flow
        url = `https://${apiBaseUrl}/whatsapp/1/message/template`;
        const bodyPlaceholders = templatePlaceholders.slice(0, 2);
        const buttonPlaceholder = templatePlaceholders[2];

        payload = {
            messages: [{
                from: senderNumber,
                to: cleanPhone,
                content: {
                    templateName: templateName,
                    templateData: {
                        body: {
                            placeholders: bodyPlaceholders
                        },
                        ...(buttonPlaceholder && {
                            buttons: [
                                {
                                    type: 'URL',
                                    parameter: buttonPlaceholder
                                }
                            ]
                        })
                    },
                    language: 'en'
                }
            }]
        };
    } else {
        // Raw Text Message Flow
        url = `https://${apiBaseUrl}/whatsapp/1/message/text`;
        payload = {
            messages: [{
                from: senderNumber,
                to: cleanPhone,
                content: {
                    text: message
                }
            }]
        };
    }

    console.log(`📤 Sending to Infobip: ${url}`);
    console.log(`📦 Payload: ${JSON.stringify(payload, null, 2)}`);

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
            console.error('Infobip API Error:', JSON.stringify(data, null, 2));
            throw new Error(`Infobip Error: ${JSON.stringify(data.requestError?.serviceException || 'Unknown Error')}`);
        }

        return data;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

module.exports = {
    sendNotification,
};
