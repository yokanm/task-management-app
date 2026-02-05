import bcrypt from 'bcrypt';
import Users from '../models/users.model.js';
import crypto from 'crypto';
import { generateRefreshToken, generateToken, verifyRefreshToken } from '../utils/generateToken.js';

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    // Single declaration, moved inside try block
    const { username, email, password } = req.body;

    // Check both email AND username uniqueness
    const existingUser = await Users.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      // Return specific error message
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists!',
        });
      }
      if (existingUser.username === username) {
        return res.status(409).json({
          success: false,
          error: 'Username already exists!',
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new Users({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    
    const token = generateToken(newUser._id, res); 
    // Consistent response format
    res.status(201).json({
      token, 
      user:{
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      success: true,
      message: 'User created successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Something went wrong!',
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials!',
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials!',
      });
    }

     // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate tokens
        const accessToken = generateToken(user._id, res);
        const refreshToken = generateRefreshToken(user._id);
        
        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save();
        
        res.status(200).json({ 
            success: true,
            message: "Login successful!", 
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                preferences: user.preferences
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!'
        });
    }
}



/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired refresh token'
            });
        }

        // Find user and verify refresh token matches
        const user = await Users.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const newAccessToken = generateToken(user._id, res);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            error: 'Something went wrong!'
        });
    }

    
};

/**
 * @desc    Request password reset
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            return res.status(200).json({
                success: true,
                message: 'If the email exists, a password reset link has been sent.'
            });
        }
       

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save hashed token and expiry to database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // // Send email (implement this function based on your email service)
        // await sendPasswordResetEmail(user.email, resetURL);

        // res.status(200).json({
        //     success: true,
        //     message: 'Password reset link sent to your email'
        // });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'Error sending password reset email'
        });
    }
};

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
  const resetPassword = async (req, res) => {
      try {
          const { token } = req.params;
          const { password } = req.body;

          // Hash the token from URL
          const hashedToken = crypto
              .createHash('sha256')
              .update(token)
              .digest('hex');

          // Find user with valid token
          const user = await Users.findOne({
              resetPasswordToken: hashedToken,
              resetPasswordExpires: { $gt: Date.now() }
          });

          if (!user) {
              return res.status(400).json({
                  success: false,
                  error: 'Invalid or expired reset token'
              });
          }

          // Hash new password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          // Update password and clear reset token
          user.password = hashedPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.refreshToken = undefined; // Invalidate refresh token
          await user.save();

          res.status(200).json({
              success: true,
              message: 'Password reset successful! Please login with your new password.'
          });

      } catch (error) {
          console.error('Reset password error:', error);
          res.status(500).json({
              success: false,
              error: 'Error resetting password'
          });
      }
  };

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
  const logout = async (req, res) => {
      try {
          const userId = req.user?.id;

          // Clear refresh token from database
          if (userId) {
              await Users.findByIdAndUpdate(userId, {
                  refreshToken: undefined
              });
          }

          // Clear JWT cookie
          res.clearCookie('jwt', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
          });
          
          res.status(200).json({ 
              success: true,
              message: "Logged out successfully" 
          });
          
      } catch (error) {
          console.error('Logout error:', error);
          res.status(500).json({ 
              success: false,
              error: 'Something went wrong!' 
          });
      }
  }

export { 
    register, 
    login, 
    refreshToken,
    forgotPassword,
    resetPassword,
    logout 
};

