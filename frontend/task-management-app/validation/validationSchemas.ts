import { z } from 'zod';

// Task validation schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  status: z.enum(['To do', 'In Progress', 'Completed']).default('To do'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  dueDate: z.string().optional(),
  dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;