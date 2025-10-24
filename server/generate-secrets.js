/**
 * Generate Secure JWT Secrets
 * Run this script to generate secure random secrets for JWT tokens
 */

import crypto from 'crypto';

console.log('\n🔐 Generating Secure JWT Secrets...\n');
console.log('Copy these values to your .env file:\n');
console.log('─'.repeat(60));

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');

console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);

console.log('─'.repeat(60));
console.log('\n✅ Secrets generated successfully!');
console.log('⚠️  Keep these secrets safe and never commit them to git!\n');
