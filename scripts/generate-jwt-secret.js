#!/usr/bin/env node

/**
 * Generate JWT Secret
 * 
 * Script untuk generate random JWT secret yang kuat untuk production.
 * 
 * Usage:
 *   node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

function generateJWTSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

console.log('\n🔐 JWT Secret Generator\n');
console.log('Generated JWT Secret (copy to .env):');
console.log('─'.repeat(80));
console.log(generateJWTSecret());
console.log('─'.repeat(80));
console.log('\n💡 Add this to your .env file:');
console.log(`JWT_SECRET=${generateJWTSecret()}`);
console.log('\n⚠️  IMPORTANT: Keep this secret safe and never commit to Git!\n');
