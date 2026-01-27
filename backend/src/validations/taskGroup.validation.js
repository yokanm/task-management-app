import { z } from 'zod';

import { objectIdSchema, hexColorSchema } from '../utils/helperSchemas.js';

// Create task group validation schema
export const createTaskGroupSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Task group name is required',
        invalid_type_error: 'Task group name must be a string',
      })
      .min(1, 'Task group name is required')
      .max(50, 'Task group name must not exceed 50 characters')
      .trim(),

    icon: z
      .string()
      .max(10, 'Icon must not exceed 10 characters')
      .optional()
      .or(z.literal('')),

    color: hexColorSchema.default('#6C5DD3'),
  }),
});

// Update task group validation schema
export const updateTaskGroupSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Task group name cannot be empty')
      .max(50, 'Task group name must not exceed 50 characters')
      .trim()
      .optional(),

    icon: z
      .string()
      .max(10, 'Icon must not exceed 10 characters')
      .optional()
      .or(z.literal('')),

    color: hexColorSchema.optional(),
  }),

  params: z.object({
    id: objectIdSchema,
  }),
});

// Task group ID param validation
export const taskGroupIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});
