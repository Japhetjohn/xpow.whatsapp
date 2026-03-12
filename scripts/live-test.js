const fs = require('fs');
const path = require('path');

// Manually parse .env for credentials
const envPath = path.join(__dirname, '../.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) env[match[1].trim()] = match[2].trim();
});

const API_KEY = env.XPOW_SECRET_KEY;
const BASE_URL = 'https://xpow.io'; // Final production domain
const TEST_PHONE = '+2348083895719'; // User's phone number

async function runLiveTest() {
    console.log(`🚀 Starting Live Production Test...`);
    console.log(`🔗 Endpoint: ${BASE_URL}/send-notification`);

    const payloadBooking = {
        phone: TEST_PHONE,
        templateName: 'new_booking_notification',
        templatePlaceholders: ['Premium Strategy', '500 USDC'],
        link: 'https://xpow.io/dashboard/bookings/999'
    };

    const payloadGeneral = {
        phone: TEST_PHONE,
        templateName: 'xpow_notification',
        templatePlaceholders: ['Japhet', 'Your account has been verified!'],
        link: 'https://xpow.app/notifications/welcome-123'
    };

    async function send(payload, label) {
        console.log(`\n🧪 Testing: ${label}...`);
        try {
            const response = await fetch(`${BASE_URL}/send-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY
                },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (response.ok) {
                console.log(`✅ PASS: ${label} successful!`);
                console.log('📦 Server Response ID:', result.messageId);
            } else {
                console.error(`❌ FAIL: ${label} - ${JSON.stringify(result)}`);
            }
        } catch (e) {
            console.error(`❌ ERROR: ${label} - ${e.message}`);
        }
    }

    await send(payloadBooking, 'Booking Template');
    await send(payloadGeneral, 'General Utility Template');
}

runLiveTest();
