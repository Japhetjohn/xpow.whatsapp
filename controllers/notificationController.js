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
        message: Joi.string().min(1).optional(),
        link: Joi.string().uri().optional(),
        templateName: Joi.string().optional(),
        templatePlaceholders: Joi.array().items(Joi.string()).optional(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: 'error',
            message: error.details[0].message,
        });
    }

    const { phone, message, link, templateName, templatePlaceholders } = value;

    try {
        let finalPlaceholders = templatePlaceholders || [];

        // Logic for fully dynamic xpow.io links in templates
        if (templateName && link && link.startsWith('https://xpow.io/')) {
            const pathAfterBase = link.replace('https://xpow.io/', '');
            // Append the path as the 3rd placeholder ({{3}}) for our template
            // We assume {{1}} is service name, {{2}} is amount, {{3}} is link path
            if (finalPlaceholders.length < 3) {
                finalPlaceholders[2] = pathAfterBase;
            }
        }

        const result = await sendNotification({
            phone,
            message: message ? `${message}\n\n[Check it out](${link})` : undefined,
            templateName,
            templatePlaceholders: finalPlaceholders
        });

        const messageId = result.messages?.[0]?.messageId;

        return res.status(200).json({
            status: 'success',
            message: 'WhatsApp notification queued',
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
