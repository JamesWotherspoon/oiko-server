const bodySchema = {
  post: {
    type: 'object',
    properties: {
      categoryId: { type: 'integer' },
      transactionType: { type: 'string', enum: ['income', 'expense'] },
      name: { type: 'string' },
      amount: { type: 'number' },
      transactionDate: { type: 'string', format: 'date' },
      description: { type: 'string' },
    },
    required: ['transactionType', 'amount', 'transactionDate'],
    additionalProperties: false,
  },
};

const querySchema = {
  type: 'object',
  properties: {
    from: {
      type: 'string',
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
    },
    to: {
      type: 'string',
      pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}$',
    },
    categoryId: { type: 'integer', minimum: 1 },
    scheduledTransactionId: { type: 'integer', minimum: 1 },
    transactionType: { type: 'string', enum: ['income', 'expense'] },
    name: { type: 'string', maxLength: 200 },
    minAmount: { type: 'number', minimum: 0 },
    maxAmount: { type: 'number', minimum: 0 },
    description: { type: 'string' },
  },
  additionalProperties: false,
};

module.exports = { querySchema, bodySchema };
