import { z } from 'zod';
import { objectIdSchema, hexColorSchema } from '../utils/helperSchemas.js';

/**
 * Create project validation schema.
 *
 * NOTE: `taskGroup` is an optional ObjectId reference.
 * If omitted, the controller auto-creates a default TaskGroup.
 * The old string-enum approach ('Work' | 'Personal' | …) was wrong
 * because the model stores a MongoDB ObjectId, not a string label.
 */
export const createProjectSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: 'Project name is required',
          invalid_type_error: 'Project name must be a string',
        })
        .min(1, 'Project name is required')
        .max(100, 'Project name must not exceed 100 characters')
        .trim(),

      description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional()
        .or(z.literal('')),

      logo: z
        .string()
        .url('Invalid logo URL')
        .optional()
        .or(z.literal('')),

      // Accept a valid 24-char hex ObjectId (controller auto-creates if absent)
      taskGroup: objectIdSchema.optional(),

      startDate: z.coerce.date({
        required_error: 'Start date is required',
        invalid_type_error: 'Invalid start date format',
      }),

      endDate: z.coerce.date({
        required_error: 'End date is required',
        invalid_type_error: 'Invalid end date format',
      }),

      color: hexColorSchema.default('#6C5DD3'),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: 'End date must be after start date',
      path: ['endDate'],
    }),
});

/** Update project validation schema */
export const updateProjectSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(1, 'Project name cannot be empty')
        .max(100, 'Project name must not exceed 100 characters')
        .trim()
        .optional(),

      description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional()
        .or(z.literal('')),

      logo: z
        .string()
        .url('Invalid logo URL')
        .optional()
        .or(z.literal('')),

      taskGroup: objectIdSchema.optional(),

      startDate: z.coerce.date().optional(),

      endDate: z.coerce.date().optional(),

      color: hexColorSchema.optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return data.endDate > data.startDate;
        }
        return true;
      },
      {
        message: 'End date must be after start date',
        path: ['endDate'],
      }
    ),

  params: z.object({
    id: objectIdSchema,
  }),
});

/** Project ID param-only schema (for GET / DELETE by ID) */
export const projectIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});