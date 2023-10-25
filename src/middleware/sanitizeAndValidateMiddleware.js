const Ajv = require('ajv');
const { badRequest } = require('../utils/responseHandlerUtils');
const { sanitizeObject } = require('../utils/sanitizeUtils');

const sanitizeAndValidate = (requestDataSource, schema) => {
  const source = requestDataSource;
  const coerceTypes = source === 'query';
  const ajv = new Ajv({ coerceTypes: coerceTypes });
  const validator = ajv.compile(schema);

  return (req, res, next) => {
    try {
      req[requestDataSource] = sanitizeObject(req[requestDataSource]);
    } catch (error) {
      return badRequest(req, res, error.message);
    }
    const valid = validator(req[source]);
    if (!valid) {
      return badRequest(req, res, validator.errors);
    }

    next();
  };
};

module.exports = { sanitizeAndValidate };
