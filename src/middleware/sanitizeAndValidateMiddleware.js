const Ajv = require('ajv');
const { BadRequestError } = require('../utils/customErrorUtils');
const { sanitizeObject } = require('../utils/sanitizeUtils');

const sanitizeAndValidate = (requestDataSource, schema) => {
  const source = requestDataSource;
  const coerceTypes = source === 'query';
  const ajv = new Ajv({ coerceTypes: coerceTypes });
  const validator = ajv.compile(schema);

  return (req, res, next) => {
    try {
      // Sanitize the request object
      req[requestDataSource] = sanitizeObject(req[requestDataSource]);
      console.log(req.body);
      // Validate the request object against api schema
      const valid = validator(req[source]);

      if (!valid) throw new BadRequestError('Invalid request data', 'INVALID_REQUEST_DATA', validator.errors);
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { sanitizeAndValidate };
