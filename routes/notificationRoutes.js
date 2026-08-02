const express = require('express');
const router = express.Router();
const { sendNotificationController } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// Route: POST /send-notification
router.post('/send-notification', authMiddleware, sendNotificationController);

// Meta Webhook Verification
router.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;
    
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('✅ WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// Meta Webhook Payload handler
router.post('/webhook', (req, res) => {
    const body = req.body;
    if (body.object) {
        // You can add your whatsapp message handling logic here in the future
        console.log('📩 Incoming Webhook Event:', JSON.stringify(body, null, 2));
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
