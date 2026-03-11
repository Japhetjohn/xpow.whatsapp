const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.join(__dirname, '../.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const apiBaseUrl = env.INFOBIP_API_BASE_URL;
const apiKey = env.INFOBIP_API_KEY;
const senderNumber = env.INFOBIP_SENDER_NUMBER || '447860099299';
const toNumber = '2348083895719'; // User's number

async function sendTestMessage() {
    console.log('⏳ Sending WhatsApp message via Infobip...');

    const url = `https://${apiBaseUrl}/whatsapp/1/message/text`;

    const payload = {
        from: senderNumber,
        to: toNumber,
        content: {
            text: 'Final check from your XPOW Bot! 🚀 Debugging delivery...'
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
        console.log('📦 FULL INFOBIP RESPONSE:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log(`✅ Success status returned.`);
        } else {
            console.error(`❌ Infobip API Error.`);
        }
    } catch (error) {
        console.error(`❌ Network error:`, error);
    }
}

sendTestMessage();
