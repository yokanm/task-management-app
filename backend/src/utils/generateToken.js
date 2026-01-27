import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
};

export const generateRefreshToken = (userId) => {
    const refreshToken = jwt.sign(
        { id: userId },
        config.JWT_REFRESH_SECRET || config.JWT_SECRET,
        { 
            expiresIn: config.JWT_REFRESH_EXPIRES_IN || '7d' // 7 days
        }
    );

    return refreshToken;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(
            token, 
            config.JWT_REFRESH_SECRET || config.JWT_SECRET
        );
        return decoded;
    } catch (error) {
        console.error('Refresh token verification failed:', error.message);
        return null;
    }
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('Access token verification failed:', error.message);
        return null;
    }
};

export default {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
};
