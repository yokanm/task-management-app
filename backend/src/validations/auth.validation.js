
import { z } from 'zod';

// Registration validation schema
export const registerSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string'
    })
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
      .trim(),
    
    email: z.string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    })
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must not exceed 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
  })
});

// Login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
      .email('Invalid email address')
      .toLowerCase()
      .trim(),
    
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string'
    })
      .min(1, 'Password is required')
  })
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string'
    })
      .email('Invalid email address')
      .toLowerCase()
      .trim()
  })
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: 'New password is required',
      invalid_type_error: 'Password must be a string'
    })
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must not exceed 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    
    confirmPassword: z.string({
      required_error: 'Password confirmation is required'
    })
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  }),
  
  params: z.object({
    token: z.string({
      required_error: 'Reset token is required'
    })
      .min(1, 'Reset token is required')
  })
});

// Refresh token validation schema
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required',
      invalid_type_error: 'Refresh token must be a string'
    })
      .min(1, 'Refresh token is required')
  })
});