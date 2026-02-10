import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUserById,
  changePassword,
  getPreferences,
  updatePreferences,
  deleteAccount,
} from '../controllers/users.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  updateProfileSchema,
  changePasswordSchema,
  updatePreferencesSchema,
  userIdSchema,
  deleteAccountSchema,
} from '../validations/user.validation.js';

const router = Router();

/**
 * IMPORTANT: Named routes (/profile, /change-password, /preferences)
 * MUST be declared before the dynamic /:id route.
 * Express matches routes top-to-bottom; if /:id is first, Express would
 * treat 'profile', 'change-password', and 'preferences' as ID values.
 */

// --- Static named routes first ---

/** GET /api/v1/users/profile — Get current user profile */
router.get('/api/v1/users/profile', authMiddleware, getProfile);

/** PUT /api/v1/users/profile — Update current user profile */
router.put(
  '/api/v1/users/profile',
  authMiddleware,
  validate(updateProfileSchema),
  updateProfile
);

/** PUT /api/v1/users/change-password — Change password */
router.put(
  '/api/v1/users/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  changePassword
);

/** GET /api/v1/users/preferences — Get preferences */
router.get('/api/v1/users/preferences', authMiddleware, getPreferences);

/** PUT /api/v1/users/preferences — Update preferences */
router.put(
  '/api/v1/users/preferences',
  authMiddleware,
  validate(updatePreferencesSchema),
  updatePreferences
);

/** DELETE /api/v1/users/account — Soft-delete account */
router.delete(
  '/api/v1/users/account',
  authMiddleware,
  validate(deleteAccountSchema),
  deleteAccount
);

// --- Dynamic route last ---

/** GET /api/v1/users/:id — Get any user by ID (must be last) */
router.get(
  '/api/v1/users/:id',
  authMiddleware,
  validate(userIdSchema),
  getUserById
);

export default router;