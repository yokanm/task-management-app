import { ZodError } from 'zod';

/**
 * Middleware to validate request data using Zod schemas
 * @param {Object} schema - Zod validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate the request data
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // If validation passes, just continue
      // No need to reassign as Zod doesn't transform by default
      // and req.query is read-only in Express 5
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a user-friendly structure
        // Use error.issues instead of error.errors
        const formattedErrors = error.issues?.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })) || [];

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      // Handle unexpected errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};