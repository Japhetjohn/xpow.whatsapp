#!/bin/bash

# Configuration
VPS_IP="72.61.97.210"
VPS_USER="root"
VPS_PASS="@Kuulsinim45"
REMOTE_PATH="/root/whatsapp-bot"
ZIP_FILE="deploy.tar.gz"

echo "🚀 Starting deployment to $VPS_IP..."

echo "📦 Packaging files..."
# Construct target list based on existing files
TARGETS="controllers middleware routes scripts services public package.json ecosystem.config.js server.js .env"

tar --exclude="*.map" -czf $ZIP_FILE $TARGETS || true

echo "📤 Transferring package to VPS..."
$HOME/.local/bin/sshpass -p "$VPS_PASS" scp -o StrictHostKeyChecking=no $ZIP_FILE "$VPS_USER@$VPS_IP:/root/"

echo "⚙️ Setting up on VPS..."
SSHPASS="$VPS_PASS" $HOME/.local/bin/sshpass -e ssh -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" << EOF
    mkdir -p $REMOTE_PATH
    mv /root/$ZIP_FILE $REMOTE_PATH/
    cd $REMOTE_PATH
    tar -xzf $ZIP_FILE
    rm $ZIP_FILE
    rm -rf node_modules
    npm install --no-audit --no-fund
    
    # PM2 Management - Specifically restart whatsapp-bot
    echo "🚀 Restarting apps via PM2..."
    pm2 delete whatsapp-bot > /dev/null 2>&1 || true
    pm2 start ecosystem.config.js --env production
    pm2 save
    
    echo "✨ Deployment successful!"
EOF

rm $ZIP_FILE
echo "✨ Deployment script completed globally!"
