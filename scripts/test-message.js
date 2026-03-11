const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const accountSid = env.TWILIO_ACCOUNT_SID;
const authToken = env.TWILIO_AUTH_TOKEN;
const fromNumber = env.TWILIO_WHATSAPP_NUMBER;
const toNumber = 'whatsapp:+2348083895719';

const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

async function sendTestMessage() {
    console.log('⏳ Sending raw REST API request to Twilio...');
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const params = new URLSearchParams();
    params.append('To', toNumber);
    params.append('From', fromNumber);
    params.append('Body', 'Hello from your NEW XPOW WhatsApp Bot! 🚀 New credentials verified.');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`✅ Success! Message sent with SID: ${data.sid}`);
        } else {
            console.error(`❌ Twilio API Error:`, data);
            if (data.code === 21608) {
                console.log('💡 TIP: You might need to join the sandbox for this NEW account first!');
            }
        }
    } catch (error) {
        console.error(`❌ Network error while sending message:`, error);
    }
}

sendTestMessage();
