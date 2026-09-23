const { ZodError } = require('zod');

/**
 * validate(zodSchema) — Zod-based request validation middleware.
 * 
 * Validates `req.body`, `req.query`, and `req.params` against a Zod schema.
 * The schema should be an object with optional keys: `body`, `query`, `params`.
 * 
 * Usage:
 *   const schema = { body: z.object({ email: z.string().email() }) };
 *   router.post('/login', validate(schema), handler);
 * 
 *   const fullSchema = {
 *     body: z.object({ title: z.string().min(1) }),
 *     params: z.object({ id: z.string().cuid() }),
 *     query: z.object({ page: z.coerce.number().optional() }),
 *   };
 *   router.put('/:id', validate(fullSchema), handler);
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query params
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }

      // Validate URL params
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || error.errors || [];
        const formattedErrors = issues.map((err) => ({
          field: (err.path || []).join('.'),
          message: err.message,
          code: err.code,
        }));

        const firstMsg = formattedErrors[0]?.message || 'Validation failed';
        return res.status(400).json({
          success: false,
          message: firstMsg,
          errors: formattedErrors,
        });
      }

      // Unexpected error
      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
      });
    }
  };
};

module.exports = { validate };
