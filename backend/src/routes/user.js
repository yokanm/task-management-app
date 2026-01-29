
import { Router } from "express";
import { 
    getProfile,
    updateProfile,
    getUserById,
    changePassword,
    getPreferences,
    updatePreferences,
    deleteAccount
} from "../controllers/users.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { 
    updateProfileSchema,
    changePasswordSchema,
    updatePreferencesSchema,
    userIdSchema,
    deleteAccountSchema
} from "../validations/user.validation.js";

const router = Router();


/**
 * @route   GET /api/v1/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/api/v1/users/profile', authMiddleware, getProfile);

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/api/v1/users/profile', authMiddleware, validate(updateProfileSchema), updateProfile);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID (for viewing collaborators)
 * @access  Private
 */
router.get('/api/v1/users/:id', authMiddleware, validate(userIdSchema), getUserById);


/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/api/v1/users/change-password', authMiddleware, validate(changePasswordSchema), changePassword);



/**
 * @route   GET /api/v1/users/preferences
 * @desc    Get user preferences
 * @access  Private
 */
router.get('/api/v1/users/preferences', authMiddleware, getPreferences);

/**
 * @route   PUT /api/v1/users/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/api/v1/users/preferences', authMiddleware, validate(updatePreferencesSchema), updatePreferences);


/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/api/v1/users/account', authMiddleware, validate(deleteAccountSchema), deleteAccount);

export default router;