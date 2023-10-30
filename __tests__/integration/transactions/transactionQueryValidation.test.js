const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('Transaction Query Validation', () => {
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
  test('should return 400 if date is not correctly formatted', async () => {
    const response = await agent.get('/api/transactions').query({
      from: '01-03-2023',
      to: '06-07-2023',
    });
    expect(response.statusCode).toEqual(400);
  });
  test('should return 200 if date is correctly formatted', async () => {
    const response = await agent.get('/api/transactions').query({
      from: '2023-01-03',
      to: '2023-06-07',
    });
    expect(response.statusCode).toEqual(200);
  });
  test('should return 400 if transactionType is not eithier income or expense', async () => {
    const response = await agent.get('/api/transactions').query({
      transactionType: 'not income or expense',
    });
    expect(response.statusCode).toEqual(400);
  });
  test('should return 200 if transactionType is income or expense', async () => {
    const response = await agent.get('/api/transactions').query({
      transactionType: 'income',
    });
    expect(response.statusCode).toEqual(200);
  });
  test('should return 400 if query key is not supported', async () => {
    const response = await agent.get('/api/transactions').query({
      queryKey: 'not supported',
    });
    expect(response.statusCode).toEqual(400);
  });
});
