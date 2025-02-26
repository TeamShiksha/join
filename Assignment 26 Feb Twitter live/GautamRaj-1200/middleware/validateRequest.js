/**
 * Middleware for validating request data against a Joi schema
 * 
 * @param {Object} schema - Joi schema to validate against
 * @param {string} property - Request property to validate ('body', 'params', 'query')
 */
const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
      const { error } = schema.validate(req[property]);
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({
          success: false,
          message: errorMessage
        });
      }
      
      next();
    };
  };
  
  module.exports = validateRequest;