const Category = require('../../../src/models/CategoryModel');
const ScheduledTransaction = require('../../../src/models/ScheduledTransactionModel');
const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('scheduledTransactionQuery', () => {
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
    await ScheduledTransaction.bulkCreate([
      {
        userId: user.id,
        transactionType: 'expense',
        name: 'test',
        recurrenceType: 'daily',
        amount: 1,
        active: true,
        nextTransactionDate: '2021-08-01T04:00:00.000Z',
      },
      {
        userId: user.id,
        transactionType: 'income',
        name: 'test',
        recurrenceType: 'daily',
        amount: 1010,
        active: true,
        nextTransactionDate: '2021-08-01T04:00:00.000Z',
      },
      {
        userId: user.id,
        transactionType: 'expense',
        amount: 110,
        recurrenceType: 'annually',
        name: 'test',
        active: true,
        nextTransactionDate: '2021-08-01T04:00:00.000Z',
      },
      {
        userId: user.id,
        transactionType: 'income',
        name: 'Shopping',
        recurrenceType: 'monthly',
        amount: 1010,
        categoryId: availableCategory.id,
        active: true,
        nextTransactionDate: '2021-08-01T04:00:00.000Z',
      },
    ]);
  });

  afterEach(async () => {
    await ScheduledTransaction.destroy({ where: { userId: user.id } });
  });

  it('should return all scheduled transactions in recurranceType order', async () => {
    const response = await agent.get('/api/scheduled-transactions');
    const scheduledTransactions = response.body;
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);

    expect(scheduledTransactions[0].recurrenceType).toBe('daily');
    expect(scheduledTransactions[1].recurrenceType).toBe('daily');
    expect(scheduledTransactions[2].recurrenceType).toBe('monthly');
    expect(scheduledTransactions[3].recurrenceType).toBe('annually');
  });

  it('should return scheduled transactions filtered by categoryId', async () => {
    const response = await agent.get(`/api/scheduled-transactions?categoryId=${availableCategory.id}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].categoryId).toBe(availableCategory.id);
    expect(response.body[0].name).toBe('Shopping');
  });

  it('should return scheduled transactions filtered by amount range', async () => {
    const minAmount = 105;
    const maxAmount = 115;
    const response = await agent.get(`/api/scheduled-transactions?minAmount=${minAmount}&maxAmount=${maxAmount}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].amount).toBe('110.00');
  });

  it('should return scheduled transactions filtered by transactionType', async () => {
    const response = await agent.get('/api/scheduled-transactions?transactionType=income');
    expect(response.status).toBe(200);
    expect(
      response.body.every((scheduledTransaction) => scheduledTransaction.transactionType === 'income'),
    ).toBeTruthy();
  });

  it('should return scheduled transactions filtered by name', async () => {
    const nameFilter = 'Shopp';
    const response = await agent.get(`/api/scheduled-transactions?name=${nameFilter}`);
    expect(response.status).toBe(200);
    expect(response.body.every((scheduledTransaction) => scheduledTransaction.name.includes(nameFilter))).toBeTruthy();
  });
});
