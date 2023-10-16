const Ajv = require('ajv');
const { badRequest } = require('../utils/responseHandler');

const validateQuery = (schema) => {
  const ajv = new Ajv({ coerceTypes: true });

  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.query);
    if (!valid) {
      return badRequest(req, res, validate.errors);
    }
    next();
  };
};


const validateBody = (schema) => {
  const ajv = new Ajv();

  return (req, res, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      return badRequest(req, res, validate.errors);
    }
    next();
  };
};

module.exports = { validateBody, validateQuery };
