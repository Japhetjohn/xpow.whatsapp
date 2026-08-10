/**
 * Sends a WhatsApp notification via Meta Cloud API.
 * Supports both raw text and predefined templates.
 * 
 * @param {object} params - Notification parameters.
 * @param {string} params.phone - Recipient phone (e.g., +234...)
 * @param {string} [params.message] - Raw text message.
 * @param {string} [params.templateName] - Name of the WhatsApp template.
 * @param {Array} [params.templatePlaceholders] - Values for {{1}}, {{2}}, etc.
 * @returns {Promise<object>} - Meta response.
 */
const sendNotification = async ({ phone, message, templateName, templatePlaceholders = [] }) => {
    // Meta requires the phone number without the '+' symbol
    const cleanPhone = phone.replace('+', '').replace('whatsapp:', '');
    
    const token = process.env.META_ACCESS_TOKEN;
    const phoneId = process.env.META_PHONE_NUMBER_ID;
    
    const url = `https://graph.facebook.com/v19.0/${phoneId}/messages`;
    
    let payload;

    if (templateName) {
        // Meta Template Message Flow
        const bodyPlaceholders = templatePlaceholders.slice(0, 2);
        const buttonPlaceholder = templatePlaceholders[2]; // if exists
        
        let components = [];
        
        if (bodyPlaceholders.length > 0) {
            components.push({
                type: "body",
                parameters: bodyPlaceholders.map(val => ({ type: "text", text: val }))
            });
        }
        
        if (buttonPlaceholder) {
            components.push({
                type: "button",
                sub_type: "url",
                index: "0",
                parameters: [
                    { type: "text", text: buttonPlaceholder }
                ]
            });
        }

        payload = {
            messaging_product: "whatsapp",
            to: cleanPhone,
            type: "template",
            template: {
                name: templateName,
                language: { code: "en_US" },
                components: components.length > 0 ? components : undefined
            }
        };
    } else {
        // Raw Text Message Flow (Requires active 24h conversation window)
        payload = {
            messaging_product: "whatsapp",
            to: cleanPhone,
            type: "text",
            text: {
                body: message
            }
        };
    }

    console.log(`📤 Sending to Meta API: ${url}`);
    
    try {
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
            throw new Error(`Meta Error: ${data.error?.message || 'Unknown Error'}`);
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
