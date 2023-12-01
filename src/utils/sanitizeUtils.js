const validator = require('validator');

const sanitizeString = (input) => {
  if (!/^[a-zA-Z0-9\s-.,#@!?]*$/.test(input)) {
    throw new Error('Invalid characters in string');
  }
  return validator.escape(input);
};

const sanitizeObject = (obj) => {
  const sanitizedData = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitizedData[key] = sanitizeString(obj[key]);
    } else {
      sanitizedData[key] = obj[key];
    }
  }
  return sanitizedData;
};

const normalizeText = (text) => {
  return text.trim().toLowerCase();
};

module.exports = {
  normalizeText,
  sanitizeObject,
};
