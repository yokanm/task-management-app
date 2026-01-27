import { z } from 'zod';
import { objectIdSchema } from '../utils/helperSchemas.js';

// Update profile validation schema
export const updateProfileSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      )
      .trim()
      .optional(),

    bio: z
      .string()
      .max(500, 'Bio must not exceed 500 characters')
      .trim()
      .optional()
      .or(z.literal('')),

    location: z
      .string()
      .max(100, 'Location must not exceed 100 characters')
      .trim()
      .optional()
      .or(z.literal('')),

    website: z
      .string()
      .url('Invalid website URL')
      .max(200, 'Website URL must not exceed 200 characters')
      .optional()
      .or(z.literal('')),
  }),
});

// Change password validation schema
export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string({
          required_error: 'Current password is required',
          invalid_type_error: 'Current password must be a string',
        })
        .min(1, 'Current password is required'),

      newPassword: z
        .string({
          required_error: 'New password is required',
          invalid_type_error: 'New password must be a string',
        })
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          'Password must contain at least one special character'
        ),

      confirmPassword: z.string({
        required_error: 'Password confirmation is required',
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});

// Update preferences validation schema
export const updatePreferencesSchema = z.object({
  body: z.object({
    theme: z
      .enum(['light', 'dark', 'system'], {
        errorMap: () => ({
          message: 'Theme must be one of: light, dark, system',
        }),
      })
      .optional(),

    language: z
      .string()
      .max(10, 'Language code must not exceed 10 characters')
      .optional(),

    notifications: z
      .object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        taskReminders: z.boolean().optional(),
        projectUpdates: z.boolean().optional(),
      })
      .optional(),

    dateFormat: z
      .enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], {
        errorMap: () => ({
          message:
            'Date format must be one of: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD',
        }),
      })
      .optional(),

    timeFormat: z
      .enum(['12h', '24h'], {
        errorMap: () => ({ message: 'Time format must be one of: 12h, 24h' }),
      })
      .optional(),

    weekStartsOn: z
      .enum(['Sunday', 'Monday'], {
        errorMap: () => ({
          message: 'Week start must be one of: Sunday, Monday',
        }),
      })
      .optional(),
  }),
});

// User ID param validation
export const userIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

// Delete account validation schema
export const deleteAccountSchema = z.object({
  body: z.object({
    password: z
      .string()
      .min(1, 'Password is required to delete account')
      .optional(), // Optional because OAuth users don't have passwords
  }),
});
