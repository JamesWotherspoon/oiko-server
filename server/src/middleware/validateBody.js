// Import the necessary modules
const { body, validationResult } = require('express-validator');
const { apiRequestErrorLogger } = require('./logging.middleware');
// Example

const validateBody = (payloadSchema) => {
  const validations = [];

  Object.entries(payloadSchema).forEach(([param, [requirement, type, allowedValues]]) => {
    let validationChain = body(param);

    if (requirement === 'required') validationChain = validationChain.notEmpty().withMessage(`${param} is required`);

    switch (type) {
    case 'integer':
      validationChain = validationChain.isInt().withMessage(`${param} must be an integer`);
      break;
    case 'string':
      validationChain = validationChain.isString().withMessage(`${param} must be a string`);
      break;
    case 'number':
      validationChain = validationChain.isNumeric().withMessage(`${param} must be a number`);
      break;
    case 'date':
      validationChain = validationChain.isISO8601().withMessage(`${param} must be a valid date`);
      break;
      // Add more cases as per your requirements
    }

    if (allowedValues) {
      validationChain = validationChain
        .isIn(allowedValues)
        .withMessage(`${param} must be one of: ${allowedValues.join(', ')}`);
    }

    validations.push(validationChain);
  });

  validations.push((req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      apiRequestErrorLogger.error({ path: req.path, error: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  });

  return validations;
};

module.exports = validateBody;
