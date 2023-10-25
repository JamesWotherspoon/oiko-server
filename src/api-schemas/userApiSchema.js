const bodySchema = {
  login: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      password: {
        type: 'string',
        minLength: 8,
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  },
};

module.exports = { bodySchema };
