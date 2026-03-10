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
    console.log('⏳ Sending WhatsApp Interactive Button...');

    // The ONLY way to send a URL button in WhatsApp WITHOUT an approved template 
    // is to use the specific WhatsApp Interactive message JSON object. 
    // Since we are hitting Twilio's form-urlencoded endpoint, we must serialize 
    // the 'body' or use the Twilio Content Variables array if configured.
    // Actually, standard Twilio SMS API does not support raw JSON Interactive objects directly 
    // in the 'Body' parameter. You MUST use a pre-approved WhatsApp Template to get URL buttons, 
    // OR use Twilio's Content API.

    // Let's attempt the Twilio native button formatting (often blocked in Sandbox but worth a try)
    // We'll use the specific WhatsApp Interactive Message payload format via the Content API
    // Wait, the standard Twilio REST API for Messages doesn't natively parse raw JSON for buttons without Content API.

    console.log('❌ NOTE: URL Buttons (Call-to-Action) CANNOT be sent dynamically as free-form text in WhatsApp, even with code.');
    console.log('❌ They REQUIRE a pre-approved Meta/WhatsApp Template created in the Twilio Console.');
    console.log('❌ In the Sandbox, Twilio ONLY allows their 3 pre-built templates, none of which are URL buttons.');
}

sendTestMessage();
