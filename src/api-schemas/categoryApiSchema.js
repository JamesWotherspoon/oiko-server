const bodySchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['income', 'expense'] },
    name: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['type', 'name'],
  additionalProperties: false,
};

const querySchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['income', 'expense'] },
  },
  additionalProperties: false,
};

module.exports = { querySchema, bodySchema };
