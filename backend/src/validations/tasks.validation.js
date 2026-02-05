import { z } from 'zod';
import { objectIdSchema, timeSchema } from '../utils/helperSchemas.js';

// Create task validation schema with parent field
export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Task title is required',
        invalid_type_error: 'Task title must be a string',
      })
      .min(1, 'Task title is required')
      .max(200, 'Task title must not exceed 200 characters')
      .trim(),

    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .trim()
      .optional()
      .or(z.literal('')),

    status: z
      .enum(['To do', 'In Progress', 'Completed'], {
        errorMap: () => ({
          message: 'Status must be one of: To do, In Progress, Completed',
        }),
      })
      .default('To do'),

    priority: z
      .enum(['Low', 'Medium', 'High'], {
        errorMap: () => ({
          message: 'Priority must be one of: Low, Medium, High',
        }),
      })
      .default('Medium'),

    dueDate: z.coerce
      .date({
        invalid_type_error: 'Invalid due date format',
      })
      .optional()
      .nullable(),

    dueTime: timeSchema.optional().nullable(),

    // NEW: Parent field instead of separate project/taskGroup
    parent: z.object({
      id: objectIdSchema,
      type: z.enum(['Project', 'TaskGroup'], {
        errorMap: () => ({
          message: 'Parent type must be either Project or TaskGroup',
        }),
      }).default('Project'),
    }).optional().default({ type: 'Project' }),

    tags: z
      .array(z.string().trim().min(1, 'Tag cannot be empty'))
      .max(10, 'Maximum 10 tags allowed')
      .optional()
      .default([]),
  }),
});

// Update task validation schema
export const updateTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Task title cannot be empty')
      .max(200, 'Task title must not exceed 200 characters')
      .trim()
      .optional(),

    description: z
      .string()
      .max(1000, 'Description must not exceed 1000 characters')
      .trim()
      .optional()
      .or(z.literal('')),

    status: z.enum(['To do', 'In Progress', 'Completed']).optional(),

    priority: z.enum(['Low', 'Medium', 'High']).optional(),

    dueDate: z.coerce.date().optional().nullable(),

    dueTime: timeSchema.optional().nullable(),

    // NEW: Parent field (optional for updates)
    parent: z.object({
      id: objectIdSchema,
      type: z.enum(['Project', 'TaskGroup']),
    }).optional(),

    tags: z
      .array(z.string().trim().min(1, 'Tag cannot be empty'))
      .max(10, 'Maximum 10 tags allowed')
      .optional(),

    isCompleted: z.boolean().optional(),

    completedAt: z.coerce.date().optional().nullable(),
  }),

  params: z.object({
    id: objectIdSchema,
  }),
});

// Task ID param validation
export const taskIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

// Task status param validation
export const taskStatusSchema = z.object({
  params: z.object({
    status: z.enum(['To do', 'In Progress', 'Completed'], {
      errorMap: () => ({
        message: 'Status must be one of: To do, In Progress, Completed',
      }),
    }),
  }),
});