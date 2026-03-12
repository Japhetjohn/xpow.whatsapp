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
const BASE_URL = 'https://xpow.io'; // Using root domain as requested
const TEST_PHONE = '+2348083895719'; // User's phone number

async function runLiveTest() {
    console.log(`🚀 Starting Live Production Test...`);
    console.log(`🔗 Endpoint: ${BASE_URL}/send-notification`);

    const payload = {
        phone: TEST_PHONE,
        templateName: 'new_booking_notification',
        templatePlaceholders: ['Strategy Consultation', '250 USDC'],
        link: 'https://xpow.io/dashboard/bookings/789'
    };

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
            console.log('✅ PASS: API request successful!');
            console.log('📦 Server Response:', JSON.stringify(result, null, 2));
            console.log('\n📱 Check your WhatsApp! You should see a professional button message.');
        } else {
            console.error('❌ FAIL: API returned error.');
            console.error('📦 Error Detail:', JSON.stringify(result, null, 2));
            if (response.status === 404) {
                console.log('\n💡 Tip: If you get 404, your DNS might not be live yet. Try changing BASE_URL in this script to your VPS IP.');
            }
        }
    } catch (error) {
        console.error('❌ FAIL: Could not connect to server.');
        console.error('🛠 Error:', error.message);
    }
}

runLiveTest();
