/**
 * Server Startup Script
 * Ensures environment variables are loaded before starting the server
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file explicitly
const result = config({ path: join(__dirname, '.env') });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

// Validate required environment variables
const required = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:', missing.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

console.log('✅ Environment variables loaded successfully');
console.log(`📝 Loaded ${Object.keys(result.parsed || {}).length} environment variables`);

// Now import and start the server
import('./index.js');
