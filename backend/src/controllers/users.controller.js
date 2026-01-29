import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Users from '../models/users.model.js';
/**
 * @desc    Get current user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await Users.findById(userId).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }
        
        res.status(200).json({ 
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, bio, location, website } = req.body;
        
        const user = await Users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }

        // Check if username is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await Users.findOne({ username });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: "Username already taken!"
                });
            }
            user.username = username;
        }

        // Update other fields
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (website !== undefined) user.website = website;

        await user.save();

        // Return updated user without sensitive data
        const updatedUser = await Users.findById(userId).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
        
        res.status(200).json({ 
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
};

/**
 * @desc    Get user by ID (for viewing collaborators/other users)
 * @route   GET /api/v1/users/:id
 * @access  Private
 */
const getUserById = async (req, res) => {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID format'
            });
        }

        const user = await Users.findById(req.params.id)
            .select('username email avatar bio location website createdAt');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }

        res.status(200).json({ 
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/v1/users/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await Users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }

        // Verify current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false,
                error: "Current password is incorrect!" 
            });
        }

        // Check if new password is different from current
        const samePassword = await bcrypt.compare(newPassword, user.password);
        if (samePassword) {
            return res.status(400).json({
                success: false,
                error: "New password must be different from current password!"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and invalidate refresh token
        user.password = hashedPassword;
        user.refreshToken = undefined;
        await user.save();

        res.status(200).json({ 
            success: true,
            message: "Password changed successfully! Please login again." 
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
};
/**
 * @desc    Get user preferences
 * @route   GET /api/v1/users/preferences
 * @access  Private
 */
const getPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await Users.findById(userId).select('preferences');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }
        
        res.status(200).json({ 
            success: true,
            data: user.preferences
        });
    } catch (error) {
        console.error('Get preferences error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
};

/**
 * @desc    Update user preferences
 * @route   PUT /api/v1/users/preferences
 * @access  Private
 */
const updatePreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const preferences = req.body;
        
        const user = await Users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }

        // Update preferences (merge with existing)
        user.preferences = {
            ...user.preferences.toObject(),
            ...preferences,
        };

        await user.save();

        res.status(200).json({ 
            success: true,
            message: "Preferences updated successfully",
            data: user.preferences
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users/account
 * @access  Private
 */
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        const user = await Users.findById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: "User not found!" 
            });
        }

        // Verify password for local accounts
        if (!password) {
            return res.status(400).json({
                success: false,
                error: "Password is required to delete account!"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ 
                success: false,
                error: "Password is incorrect!" 
            });
        }

       

        // Instead of deleting, deactivate the account (soft delete)
        user.isActive = false;
        user.email = `deleted_${Date.now()}_${user.email}`; // Prevent email conflicts
        user.username = `deleted_${Date.now()}_${user.username}`; // Prevent username conflicts
        await user.save();

        // Or hard delete (uncomment if preferred)
        // await user.deleteOne();
        // Also delete related data: tasks, projects, task groups, etc.

        res.status(200).json({ 
            success: true,
            message: "Account deleted successfully" 
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Something went wrong!' 
        });
    }
};

export {
    getProfile,
    updateProfile,
    getUserById,
    changePassword,
    getPreferences,
    updatePreferences,
    deleteAccount
};