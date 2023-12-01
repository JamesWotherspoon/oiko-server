const bodySchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['positive', 'negative'] },
    name: { type: 'string' },
    color: { type: 'string' },
    iconIdentifier: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['name'],
  additionalProperties: false,
};

const querySchema = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['positive', 'negative'] },
  },
  additionalProperties: false,
};

module.exports = { querySchema, bodySchema };
