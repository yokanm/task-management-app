// Helper schemas
import { z } from 'zod';
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

export const hexColorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    'Invalid color format (use hex format: #RRGGBB)'
  );

export const timeSchema = z
  .string()
  .regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    'Invalid time format (use HH:MM format, e.g., 09:30 or 14:45)'
  );
