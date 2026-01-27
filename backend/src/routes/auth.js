import { Router } from "express";
import { 
    login, 
    logout, 
    register,
    refreshToken,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { 
    registerSchema, 
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema
} from "../validations/auth.validation.js";

const router = Router();


/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/api/v1/auth/register', validate(registerSchema), register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/api/v1/auth/login', validate(loginSchema), login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/api/v1/auth/logout', authMiddleware, logout);


/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/api/v1/auth/refresh-token',
    validate(refreshTokenSchema), refreshToken);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/api/v1/auth/forgot-password', validate(forgotPasswordSchema), forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/api/v1/auth/reset-password/:token', validate(resetPasswordSchema), resetPassword)


export default router;
