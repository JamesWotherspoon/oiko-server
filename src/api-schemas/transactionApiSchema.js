const bodySchema = {
  type: 'object',
  properties: {
    categoryId: { type: ['integer', 'null'] },
    transactionType: { type: 'string', enum: ['positive', 'negative'] },
    name: { type: 'string' },
    amount: { type: 'number' },
    transactionDate: { type: 'string', format: 'date' },
    description: { type: 'string', maxLength: 250 },
    moneyPotId: { type: 'integer' },
  },
  required: ['moneyPotId', 'transactionType', 'amount', 'transactionDate'],
  additionalProperties: false,
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
    moneyPotId: { type: 'integer', minimum: 1 },
    categoryId: { type: 'integer', minimum: 1 },
    scheduledTransactionId: { type: 'integer', minimum: 1 },
    transactionType: { type: 'string', enum: ['positive', 'negative'] },
    name: { type: 'string', maxLength: 200 },
    minAmount: { type: 'number', minimum: 0 },
    maxAmount: { type: 'number', minimum: 0 },
    description: { type: 'string' },
    sortField: { type: 'string', enum: ['transactionDate', 'amount'] },
    sortOrder: { type: 'string', enum: ['asc', 'desc'] },
    page: { type: 'integer', minimum: 1 },
  },
  additionalProperties: false,
};

module.exports = { querySchema, bodySchema };
