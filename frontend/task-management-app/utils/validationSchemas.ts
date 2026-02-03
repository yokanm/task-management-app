import { z } from 'zod';

// ==================== AUTH SCHEMAS ====================

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'New password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'New password must contain at least one special character'),
  
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// ==================== TASK SCHEMAS ====================

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .max(200, 'Task title must not exceed 200 characters')
    .trim(),
  
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['To do', 'In Progress', 'Completed'], {
    errorMap: () => ({ message: 'Status must be "To do", "In Progress", or "Completed"' }),
  }).default('To do'),
  
  priority: z.enum(['Low', 'Medium', 'High'], {
    errorMap: () => ({ message: 'Priority must be "Low", "Medium", or "High"' }),
  }).default('Medium'),
  
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  
  dueTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Due time must be in HH:MM format (24-hour)')
    .optional()
    .or(z.literal('')),
  
  isCompleted: z.boolean().default(false),
  
  project: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid project ID')
    .optional()
    .or(z.literal('')),
  
  taskGroup: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid task group ID')
    .optional()
    .or(z.literal('')),
});

export const updateTaskSchema = taskSchema.partial();

// ==================== PROJECT SCHEMAS ====================

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must not exceed 100 characters')
    .trim(),
  
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Color must be a valid hex color code')
    .default('#5B67CA'),
  
  icon: z
    .string()
    .max(10, 'Icon must not exceed 10 characters')
    .optional()
    .or(z.literal('')),
  
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['Active', 'Completed', 'On Hold'], {
    errorMap: () => ({ message: 'Status must be "Active", "Completed", or "On Hold"' }),
  }).default('Active'),
});

export const updateProjectSchema = projectSchema.partial();

// ==================== TASK GROUP SCHEMAS ====================

export const taskGroupSchema = z.object({
  name: z
    .string()
    .min(1, 'Task group name is required')
    .max(50, 'Task group name must not exceed 50 characters')
    .trim(),
  
  description: z
    .string()
    .max(200, 'Description must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Color must be a valid hex color code')
    .default('#5B67CA'),
  
  icon: z
    .string()
    .max(10, 'Icon must not exceed 10 characters')
    .optional()
    .or(z.literal('')),
});

export const updateTaskGroupSchema = taskGroupSchema.partial();

// ==================== USER PROFILE SCHEMAS ====================

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .optional(),
  
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .optional(),
  
  avatar: z
    .string()
    .url('Avatar must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['nature', 'retro', 'ocean', 'blossom']).default('nature'),
  mode: z.enum(['light', 'dark']).default('light'),
  language: z.enum(['en', 'es', 'fr', 'de']).default('en'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    taskReminders: z.boolean().default(true),
    projectUpdates: z.boolean().default(true),
  }).default({}),
});

// ==================== TYPE EXPORTS ====================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type TaskGroupInput = z.infer<typeof taskGroupSchema>;
export type UpdateTaskGroupInput = z.infer<typeof updateTaskGroupSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;

// ==================== VALIDATION HELPERS ====================

export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  try {
    const validated = schema.parse(data);
    return { success: true as const, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      return { success: false as const, data: null, errors: formattedErrors };
    }
    return { 
      success: false as const, 
      data: null, 
      errors: { _global: 'Validation failed' } 
    };
  }
};

export const validateField = <T>(
  schema: z.ZodSchema<T>,
  field: string,
  value: unknown
) => {
  try {
    const fieldSchema = (schema as any).shape[field];
    if (!fieldSchema) return null;
    
    fieldSchema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Validation failed';
    }
    return 'Validation failed';
  }
};
