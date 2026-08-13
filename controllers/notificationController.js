const Joi = require('joi');
const { sendNotification } = require('../services/whatsappService');

/**
 * Controller to handle sending WhatsApp template notifications.
 */
const sendNotificationController = async (req, res) => {
    // Validation schema
    const schema = Joi.object({
        phone: Joi.string()
            .pattern(/^\+[1-9]\d{1,14}$/)
            .required()
            .messages({
                'string.pattern.base': 'Phone number must be in E.164 format (e.g., +2348012345678)',
            }),
        message: Joi.string().required(),
        templateName: Joi.string().optional().default("xpow_utility_notification"),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message,
        });
    }

    const { phone, message, templateName } = value;

    try {
        const result = await sendNotification({
            phone,
            message,
            templateName
        });

        const messageId = result.messages?.[0]?.id || result.messages?.[0]?.messageId;

        return res.status(200).json({
            status: 'success',
            message: 'WhatsApp template notification sent successfully',
            messageId: messageId,
        });
    } catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to send WhatsApp notification',
        });
    }
};

module.exports = {
    sendNotificationController,
};
