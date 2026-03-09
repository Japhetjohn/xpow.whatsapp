const express = require('express');
const router = express.Router();
const { sendNotificationController } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// Route: POST /send-notification
router.post('/send-notification', authMiddleware, sendNotificationController);

module.exports = router;
