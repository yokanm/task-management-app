
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


// ============================================
// Profile Management Routes
// ============================================

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

// ============================================
// Password Management Routes
// ============================================

/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/api/v1/users/change-password', authMiddleware, validate(changePasswordSchema), changePassword);

// ============================================
// Avatar Management Routes
// ============================================

/**
 * @route   POST /api/v1/users/upload-avatar
 * @desc    Upload profile picture
 * @access  Private
 */
router.post(
    '/api/v1/users/upload-avatar', 
    authMiddleware,
    upload.single('avatar'),
    uploadAvatar
);

/**
 * @route   DELETE /api/v1/users/avatar
 * @desc    Delete profile picture
 * @access  Private
 */
router.delete('/api/v1/users/avatar', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await Users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }

        // Delete from cloudinary if exists
        if (user.avatar && user.avatar.includes('cloudinary')) {
            const publicId = user.avatar.split('/').pop().split('.')[0];
            await deleteFromCloudinary(publicId);
        }

        user.avatar = '';
        await user.save();

        res.status(200).json({ 
            success: true,
            message: "Avatar deleted successfully"
        });
    } catch (error) {
        console.error('Delete avatar error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
});

// ============================================
// Preferences Management Routes
// ============================================

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

// ============================================
// Account Management Routes
// ============================================

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/api/v1/users/account', authMiddleware, validate(deleteAccountSchema), deleteAccount);

export default router;