const Ajv = require('ajv');
const { badRequest } = require('../utils/responseHandlerUtils');

const validateQuery = (schema) => {
  const ajv = new Ajv({ coerceTypes: true });
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validate(req.query);
    if (!valid) {
      return badRequest(req, res, validate.errors);
    }
    next();
  };
};


const validateBody = (schema) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validate(req.body);
    if (!valid) {
      return badRequest(req, res, validate.errors);
    }
    next();
  };
};

module.exports = { validateBody, validateQuery };
