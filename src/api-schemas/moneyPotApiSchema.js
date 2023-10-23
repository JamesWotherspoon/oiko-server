const bodySchema = {
  moneyPot: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      balance: { type: 'number' },
      description: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  },
  transfer: {
    type: 'object',
    properties: {
      amount: { type: 'number' },
      fromPotId: { type: 'integer' },
      toPotId: { type: 'integer' },
    },
    required: ['amount', 'fromPotId', 'toPotId'],
    additionalProperties: false,
  },
};

module.exports = { bodySchema };
