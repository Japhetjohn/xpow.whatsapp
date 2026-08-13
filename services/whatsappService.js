/**
 * Sends a WhatsApp notification via Meta Cloud API.
 * Uses strict Template Messaging format with en_US language code.
 * Default Template: xpow_utility_notification
 * 
 * @param {object} params - Notification parameters.
 * @param {string} params.phone - Recipient phone (e.g., +234...)
 * @param {string} params.message - The dynamic placeholder text for body variable {{1}}.
 * @param {string} [params.templateName="xpow_utility_notification"] - The template name.
 * @returns {Promise<object>} - Meta response.
 */
const sendNotification = async ({ phone, message, templateName = "xpow_utility_notification" }) => {
    const cleanPhone = phone.replace('+', '').replace('whatsapp:', '');
    
    const token = process.env.META_ACCESS_TOKEN;
    const phoneId = process.env.META_PHONE_NUMBER_ID;
    
    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;

    // Strict Meta Template Payload
    const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "template",
        template: {
            name: templateName,
            language: {
                code: "en_US"
            },
            components: [
                {
                    type: "body",
                    parameters: [
                        {
                            type: "text",
                            text: message
                        }
                    ]
                }
            ]
        }
    };

    console.log(`📤 Sending Template (${templateName}) payload to Meta API...`);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('📥 Meta API Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
        console.error('Meta API Error:', JSON.stringify(data, null, 2));
        throw new Error(`Meta Error: ${data.error?.message || JSON.stringify(data.error)}`);
    }

    return data;
};

module.exports = {
    sendNotification,
};
