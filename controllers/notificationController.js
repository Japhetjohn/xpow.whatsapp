const Joi = require('joi');
const { sendNotification } = require('../services/whatsappService');

/**
 * Controller to handle sending WhatsApp notifications.
 */
const sendNotificationController = async (req, res) => {
    // Validation schema
    const schema = Joi.object({
        phone: Joi.string()
            .pattern(/^\+[1-9]\d{1,14}$/) // E.164 format
            .required()
            .messages({
                'string.pattern.base': 'Phone number must be in E.164 format (e.g., +2348012345678)',
            }),
        message: Joi.string().min(1).required(),
        link: Joi.string().uri().required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message,
        });
    }

    const { phone, message, link } = value;

    try {
        const result = await sendNotification(phone, message, link);
        return res.status(200).json({
            status: 'sent',
            sid: result.sid,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to send WhatsApp notification',
            error: error.message,
        });
    }
};

module.exports = {
    sendNotificationController,
};
