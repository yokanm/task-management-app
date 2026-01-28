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
      const result = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Replace request data with validated (and potentially transformed) data
      req.body = result.body ?? req.body;
      req.params = result.params ?? req.params;
      req.query = result.query ?? req.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a user-friendly structure
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

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



// export const validate = (schema) => {
//     return (req, res, next) => {
//         try {
//             const result = schema.parse({
//                 body: req.body,
//                 param: req.params,
//                 query: req.query
//             });

//             // replace with validated data
//             req.body = result.body ?? req.body;
//             req.params = result.params ?? req.params;
//             req.query = result.query ?? req.query;

//             next()
//          } catch (err) {
//             return res.status(422).json({
//                 success: false,
//                 errors: err.errors
//             });
//         }
//     }
// }
