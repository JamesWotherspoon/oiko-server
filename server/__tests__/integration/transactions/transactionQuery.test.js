const Category = require('../../../src/models/Category');
const Transaction = require('../../../src/models/Transaction');
const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('transactionQuery', () => {
  let agent;
  let user;
  let availableCategory;

  beforeAll(async () => {
    // Use helper to create user and login
    ({ agent, user } = await createUserAndLogin());
    availableCategory = await Category.create({ userId: user.id, type: 'income', name: 'Salary' });
  });

  afterAll(async () => {
    // Use helper to delete user
    await deleteUser(user.id);
  });

  beforeEach(async () => {
    await Transaction.bulkCreate([
      {
        userId: user.id,
        transactionType: 'expense',
        transactionDate: '2020-01-01',
        amount: 1,
      },
      {
        userId: user.id,
        transactionType: 'income',
        transactionDate: '1997-01-01',
        amount: 1010,
      },
      {
        userId: user.id,
        transactionType: 'expense',
        amount: 100,
        transactionDate: '2023-10-16',
        name: 'Shopping',
        description: 'Grocery shopping',
      },
      {
        userId: user.id,
        transactionType: 'income',
        transactionDate: '2030-01-01',
        amount: 110,
        categoryId: availableCategory.id,
      },
    ]);
  });

  afterEach(async () => {
    await Transaction.destroy({ where: { userId: user.id } });
  });

  it('should return all transactions in descending date order', async () => {
    const response = await agent.get('/api/transactions');
    const transactions = response.body;
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    let sortedByDescDate = false;
    transactions.forEach((transaction, index) => {
      if (index > 0) {
        sortedByDescDate = new Date(transaction.transactionDate) <= new Date(transactions[index - 1].transactionDate);
      }
    });
    expect(sortedByDescDate).toBeTruthy();
  });

  it('should return transactions filtered by categoryId', async () => {
    const response = await agent.get(`/api/transactions?categoryId=${availableCategory.id}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].categoryId).toBe(availableCategory.id);
    expect(response.body[0].amount).toBe('110.00');
  });

  it('should return transactions filtered by date range', async () => {
    const startDate = '2000-01-01';
    const endDate = '2024-01-01';
    const response = await agent.get(`/api/transactions?from=${startDate}&to=${endDate}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('should return transactions filtered by amount range', async () => {
    const minAmount = 105;
    const maxAmount = 115;
    const response = await agent.get(`/api/transactions?minAmount=${minAmount}&maxAmount=${maxAmount}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].amount).toBe('110.00');
  });

  it('should return transactions filtered by description', async () => {
    const response = await agent.get('/api/transactions?description=shopping');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].description).toBe('Grocery shopping');
  });

  it('should return transactions filtered by multiple query parameters', async () => {
    const startDate = '2020-01-01';
    const endDate = '2025-01-01';
    const minAmount = 50;
    const maxAmount = 105;
    const response = await agent.get(
      `/api/transactions?from=${startDate}&to=${endDate}&minAmount=${minAmount}&maxAmount=${maxAmount}`,
    );
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].amount).toBe('100.00');
  });
  it('should return transactions filtered by transactionType', async () => {
    const response = await agent.get('/api/transactions?transactionType=income');
    expect(response.status).toBe(200);
    expect(response.body.every((transaction) => transaction.transactionType === 'income')).toBeTruthy();
  });

  it('should return transactions filtered by name', async () => {
    const nameFilter = 'Shopp';
    const response = await agent.get(`/api/transactions?name=${nameFilter}`);
    expect(response.status).toBe(200);
    expect(response.body.every((transaction) => transaction.name.includes(nameFilter))).toBeTruthy();
  });
});
