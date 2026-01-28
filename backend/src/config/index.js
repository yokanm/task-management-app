import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/task_management_app',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

export default config;

// const config = {
//   PORT: parseInt(process.env.PORT) || 5000,
//   NODE_ENV: process.env.NODE_ENV || 'development',
//   MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management_app',
//   JWT_SECRET: validateJWTSecret(),
//   JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
//   JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
//   FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
// };

// export default config;