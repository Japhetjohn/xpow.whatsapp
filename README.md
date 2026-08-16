# XPOW WhatsApp Notification Service

A lightweight, stateless Node.js middleware microservice designed to bridge your backend application with the **Meta WhatsApp Cloud API**. It provides a simple, secure REST endpoint to trigger dynamic WhatsApp Template notifications and manages incoming webhook validations from Meta.

---

## 🚀 Architecture Flow

This service acts as a "middleman" between your core application (e.g., the XPOW web server) and Meta's official WhatsApp servers:

1. **Trigger Phase:** Your core web backend sends a standard HTTP POST request to this microservice whenever an event happens (e.g., "Project payment received", "New user registered").
2. **Dispatch Phase:** This Node.js service validates the request, injects your custom message dynamically into the officially approved Meta Template (`xpow_utility_notification`), and securely pushes it directly to the Meta Graph API.
3. **Delivery:** Meta receives the verified template structure and immediately delivers the customized push notification to the user's WhatsApp client!

---

## 📋 Prerequisites & Setup

### Environment Variables (`.env`)
Create a `.env` file in the root directory. This contains all your Meta API credentials and the secure access key you'll use to protect this microservice.

```env
# Server Port
PORT=3010

# Meta WhatsApp Cloud API Credentials
META_ACCESS_TOKEN=EAAP... (System User Permanent Token)
META_PHONE_NUMBER_ID=1175757382297130
META_APP_ID=1059935686607620
META_APP_SECRET=bbbe81ff04a735329f1e1f4efe2ae7ab

# Your Internal Security Key (Required in Headers to trigger notifications)
XPOW_SECRET_KEY=generate_a_strong_secret_key

# Webhook Verification Token (For Meta Dashboard configuration)
META_WEBHOOK_VERIFY_TOKEN=xpow_secure_webhook_token_2026
```

---

## 🔌 API Endpoints

### 1. Send Notification (Trigger Endpoint)
Hit this endpoint from your XPOW server to send a message to a user.

**URL:** `POST /whatsapp/send-notification`  
*(If using the live domain: `https://your-domain.com/whatsapp/send-notification`)*

**Headers Required:**
```text
Content-Type: application/json
x-api-key: <YOUR_XPOW_SECRET_KEY>
```

**JSON Payload:**
```json
{
  "phone": "+2348083895719",
  "message": "Project payment received! 💰"
}
```

**Success Response (HTTP 200 OK):**
```json
{
  "status": "success",
  "message": "WhatsApp template notification sent successfully",
  "messageId": "wamid.HBgNM..."
}
```

---

### 2. Meta Webhooks

To receive live delivery receipts (e.g., when the message is `read` or `delivered` to the user's phone), Meta requires connecting a Webhook.

**Webhook Callback URL:** `https://your-domain.com/whatsapp/webhook`
**Verify Token:** `xpow_secure_webhook_token_2026`

* **`GET /whatsapp/webhook`**: Used strictly by Meta to verify and handshake the callback URL.
* **`POST /whatsapp/webhook`**: Used by Meta to stream event payloads (delivery receipts, inbound messages).

---

## 🏗️ Deployment (PM2)

This service is optimized to stay online permanently using PM2.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the service in production mode:
   ```bash
   pm2 start ecosystem.config.js --env production
   ```
3. Save the PM2 state to resurrect automatically on reboots:
   ```bash
   pm2 save
   pm2 startup
   ```

*To deploy code updates seamlessly without downtime, run the provided `bash deploy.sh` script!*
