const transactionApiSchema = {
  get: {
    query: {},
  },
  post: {
    body: {
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
  },
};

module.exports = transactionApiSchema;
