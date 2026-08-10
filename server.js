require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// ─── Startup Guard ────────────────────────────────────────────────────────────
const REQUIRED_ENV = [
    'META_PHONE_NUMBER_ID',
    'META_APP_ID',
    'META_ACCESS_TOKEN',
    'META_APP_SECRET',
    'META_WEBHOOK_VERIFY_TOKEN'
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   Copy .env.example → .env and fill in your values.');
    process.exit(1);
}

// ─── App Setup ────────────────────────────────────────────────────────────────
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use(notificationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'xpow-whatsapp-bot' });
});

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ XPOW WhatsApp Bot is running on port ${PORT}`);
    console.log(`🔗 Endpoint: POST /send-notification`);
});
