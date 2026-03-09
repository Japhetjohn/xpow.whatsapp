require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const secretKey = process.env.XPOW_SECRET_KEY;

    if (!apiKey || apiKey !== secretKey) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized: Invalid or missing API key',
        });
    }

    next();
};

module.exports = authMiddleware;
