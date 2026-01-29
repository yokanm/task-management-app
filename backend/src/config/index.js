
import dotenv from 'dotenv';

dotenv.config();

/**
 * Validates that JWT_SECRET exists and is secure
 * @throws {Error} if JWT_SECRET is missing or insecure in production
 */
const validateJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is required in production environment');
    }
    console.warn('⚠️  WARNING: JWT_SECRET not set. Using fallback (NOT SECURE for production)');
    return 'dev-fallback-secret-change-in-production';
  }
  
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }
  
  return secret;
};

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/task_management_app',
  JWT_SECRET: validateJWTSecret(),
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;



