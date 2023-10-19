const bodySchema = {
  type: 'object',
  properties: {
    categoryId: { type: 'integer' },
    transactionType: { type: 'string', enum: ['income', 'expense'] },
    name: { type: 'string' },
    amount: { type: 'number' },
    recurrenceType: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly', 'biannually', 'annually'] },
    dayOfWeek: { type: 'string', enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    dateOfMonth: { type: 'integer', minimum: 1, maximum: 31 },
    monthOfYear: {
      type: 'string',
      enum: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
    selectedTransactionDate: { type: 'string', format: 'date-time' },
    active: { type: 'boolean' },
    description: { type: 'string' },
  },
  required: ['transactionType', 'name', 'amount', 'recurrenceType'],
  additionalProperties: false,
};

const querySchema = {
  type: 'object',
  properties: {
    categoryId: { type: 'integer', minimum: 1 },
    transactionType: { type: 'string', enum: ['income', 'expense'] },
    name: { type: 'string' },
    minAmount: { type: 'number', minimum: 0 },
    maxAmount: { type: 'number', minimum: 0 },
    recurrenceType: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly', 'biannually', 'annually'] },
  },
  additionalProperties: false,
};

module.exports = { querySchema, bodySchema };
