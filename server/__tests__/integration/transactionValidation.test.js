
const { createUserAndLogin, deleteUser } = require('../testHelpers');

describe('Transaction Validation', () => {
  let agent;
  let user;

  beforeAll(async () => {
    // Use helper to create user and login
    ({ agent, user } = await createUserAndLogin());
  });

  afterAll(async () => {
    // Use helper to delete user
    await deleteUser(user.id);
  });

  it('should return 400 if amount is not a number', async () => {
    const res = await agent.post('/api/transactions').send({
      amount: 'not a number',
      transactionDate: '2022-01-01',
      description: 'Test transaction',
    });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 if transactionDate is not in YYYY-MM-DD format', async () => {
    const res = await agent.post('/api/transactions').send({
      amount: 10.99,
      transactionDate: 'not a transactionDate',
      description: 'Test transaction',
    });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 400 if description is not provided', async () => {
    const res = await agent.post('/api/transactions').send({
      amount: 10.99,
      transactionDate: '2022-01-01',
    });
    expect(res.statusCode).toEqual(400);
  });

  it('should return 201 if transaction is valid', async () => {
    const res = await agent.post('/api/transactions').send({
      transactionType: 'expense',
      amount: 10.99,
      transactionDate: '2022-01-01',
    });
    expect(res.statusCode).toEqual(201);
  });
});
