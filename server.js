require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// ─── Startup Guard ────────────────────────────────────────────────────────────
const REQUIRED_ENV = [
    'INFOBIP_API_BASE_URL',
    'INFOBIP_API_KEY',
    'INFOBIP_SENDER_NUMBER',
    'XPOW_SECRET_KEY',
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
    console.log(`🔗 Endpoint: POST http://localhost:${PORT}/send-notification`);
});
