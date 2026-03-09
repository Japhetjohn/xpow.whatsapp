const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use(notificationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling for undefined routes
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found',
    });
});

app.listen(PORT, () => {
    console.log(`🚀 XPOW WhatsApp Bot running on port ${PORT}`);
});
