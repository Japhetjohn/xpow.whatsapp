const crypto = require('crypto');

const apiKey = crypto.randomBytes(32).toString('hex');

console.log('\n✅ Generated XPOW API Key:');
console.log('─────────────────────────────────────────────────────────');
console.log(apiKey);
console.log('─────────────────────────────────────────────────────────');
console.log('\n📋 Add this to your .env file:');
console.log(`XPOW_SECRET_KEY=${apiKey}`);
console.log('\n🔑 Share this key with the XPOW dev team to authenticate requests.\n');
