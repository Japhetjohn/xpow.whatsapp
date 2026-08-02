module.exports = {
  apps: [{
    name: "whatsapp-bot",
    script: "./server.js",
    instances: 1,
    env_production: {
      NODE_ENV: "production",
      PORT: 3010
    }
  }]
}
