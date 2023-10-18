const Ajv = require('ajv');
const { badRequest } = require('../utils/responseHandlerUtils');

const validate = (requestDataSource, schema) => {
  const source = requestDataSource;
  const coerceTypes = source === 'query';
  const ajv = new Ajv({ coerceTypes: coerceTypes });
  const validator = ajv.compile(schema);

  return (req, res, next) => {
    const valid = validator(req[source]);
    if (!valid) {
      return badRequest(req, res, validator.errors);
    }

    next();
  };
};

module.exports = validate;
