# XPOW WhatsApp Notification Bot

A lightweight, stateless Node.js microservice that sends WhatsApp notifications for the XPOW platform via Twilio.

---

## How It Works

```
XPOW Backend  →  POST /send-notification  →  This Bot  →  Twilio  →  User's WhatsApp
```

The XPOW backend is responsible for storing user phone numbers and deciding when to notify. This bot simply receives the request and delivers the message.

---

## Endpoint

### `POST /send-notification`

**Headers:**
```
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

**Body:**
```json
{
  "phone": "+2348012345678",
  "message": "You just earned 20 XP",
  "link": "https://xpow.io/rewards"
}
```

**Response (success):**
```json
{
  "status": "sent",
  "sid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response (error):**
```json
{
  "status": "error",
  "message": "Phone number must be in E.164 format (e.g., +2348012345678)"
}
```

**Message format delivered to user:**
```
🚀 XPOW Notification

You just earned 20 XP

Open App:
https://xpow.io/rewards
```

---

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/Japhetjohn/xpow.whatsapp.git
cd xpow.whatsapp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Fill in `.env`:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
XPOW_SECRET_KEY=your_generated_api_key
PORT=3000
```

### 4. Generate your API key
```bash
node scripts/generate-key.js
```
Copy the output into your `.env` as `XPOW_SECRET_KEY`, and share the same key with the XPOW dev team.

### 5. Run the service
```bash
# Production
npm start

# Development (auto-restarts on file changes)
npm run dev
```

---

## Health Check

```bash
GET /health
```

Returns:
```json
{ "status": "ok", "service": "xpow-whatsapp-bot" }
```

---

## Project Structure

```
xpow-whatsapp-bot/
├── config/
│   └── twilio.js                # Twilio client setup
├── controllers/
│   └── notificationController.js # Request handling & Joi validation
├── middleware/
│   └── auth.js                  # API key authentication
├── routes/
│   └── notificationRoutes.js    # Route definitions
├── scripts/
│   └── generate-key.js          # API key generator
├── services/
│   └── whatsappService.js       # Message formatting & Twilio API
├── .env.example
├── server.js
└── package.json
```

---

## Phone Number Format

Phone numbers **must** be in [E.164 format](https://www.twilio.com/docs/glossary/what-e164):
- ✅ `+2348012345678`
- ❌ `08012345678`
- ❌ `2348012345678`

---

## Security

All requests must include the API key in the `x-api-key` header. Requests without a valid key will receive a `401 Unauthorized` response.
