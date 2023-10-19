const ScheduledTransaction = require('../../../src/models/ScheduledTransactionModel');
const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('ScheduledTransaction route tests', () => {
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

  afterEach(async () => {
    // Delete all scheduled transactions from the database
    await ScheduledTransaction.destroy({
      where: { userId: user.id },
    });
  });

  test('Should get all user scheduled transactions from the database', async () => {
    await ScheduledTransaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      name: 'test',
      recurrenceType: 'daily',
      active: true,
      nextTransactionDate: '2021-08-01T04:00:00.000Z',
    });

    const response = await agent.get('/api/scheduled-transactions');
    expect(response.status).toBe(200);
    expect(response.body[0].userId).toBe(user.id);
    expect(response.body[0].transactionType).toBe('income');
    expect(Number(response.body[0].amount)).toBe(100);
  });

  test('Should get a single scheduled transaction from database', async () => {
    // Create a scheduled transaction to retrieve
    const scheduledTransaction = await ScheduledTransaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      description: 'Test Description',
      name: 'test',
      recurrenceType: 'daily',
      active: true,
      nextTransactionDate: '2021-08-01T04:00:00.000Z',
    });
    // Create a second scheduled transaction to ensure that the correct scheduled transaction is returned
    await ScheduledTransaction.create({
      userId: user.id,
      transactionType: 'expense',
      amount: 69,
      description: 'Nice',
      name: 'test',
      recurrenceType: 'daily',
      active: true,
      nextTransactionDate: '2021-08-01T04:00:00.000Z',
    });
    const response = await agent.get(`/api/scheduled-transactions/${scheduledTransaction.id}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.transactionType).toBe('income');
    expect(Number(response.body.amount)).toBe(scheduledTransaction.amount);
    expect(response.body.id).toBe(scheduledTransaction.id);
  });

  test('Should add a new scheduled transaction to database', async () => {
    const scheduledTransactionAmount = 147.87;
    const response = await agent
      .post('/api/scheduled-transactions')
      .send(
        JSON.stringify({
          transactionType: 'expense',
          name: 'Test Expense',
          amount: scheduledTransactionAmount,
          description: 'Test Description',
          name: 'test',
          recurrenceType: 'daily',
        }),
      )
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);

    const scheduledTransaction = await ScheduledTransaction.findOne({
      where: { id: response.body.id },
    });

    expect(scheduledTransaction.userId).toBe(user.id);
    expect(Number(scheduledTransaction.amount)).toBe(scheduledTransactionAmount);
    expect(scheduledTransaction.transactionType).toBe('expense');
  });

  test('Should update a scheduled transaction in the database', async () => {
    const scheduledTransaction = await ScheduledTransaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      description: 'Test Description',
      name: 'test',
      recurrenceType: 'daily',
      active: true,
      nextTransactionDate: '2021-08-01T04:00:00.000Z',
    });

    const updatedScheduledTransactionAmount = 147.87;
    const response = await agent
      .put(`/api/scheduled-transactions/${scheduledTransaction.id}`)
      .send(
        JSON.stringify({
          name: 'test',
          transactionType: 'income',
          amount: updatedScheduledTransactionAmount,
          description: 'Test Description',
          recurrenceType: 'daily',
        }),
      )
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.updated).toBe(true);

    const updatedScheduledTransaction = await ScheduledTransaction.findOne({
      where: { userId: user.id },
    });

    expect(Number(updatedScheduledTransaction.amount)).toBe(updatedScheduledTransactionAmount);
    expect(updatedScheduledTransaction.name).toBe('test');
  });

  test('Should delete a scheduled transaction from the database', async () => {
    const scheduledTransaction = await ScheduledTransaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      description: 'Test Description',
      name: 'test',
      recurrenceType: 'daily',
      active: true,
      nextTransactionDate: '2021-08-01T04:00:00.000Z',
    });

    const response = await agent.delete(`/api/scheduled-transactions/${scheduledTransaction.id}`);

    expect(response.status).toBe(200);
    const deletedScheduledTransaction = await ScheduledTransaction.findOne({
      where: { id: scheduledTransaction.id, userId: user.id },
    });
    expect(deletedScheduledTransaction).toBe(null);
  });
  test('Should return nextTransactionDate and active', async () => {
    const response = await agent
      .post('/api/scheduled-transactions')
      .send(
        JSON.stringify({
          transactionType: 'expense',
          name: 'Test Expense',
          amount: 100,
          description: 'Test Description',
          name: 'test',
          recurrenceType: 'annually',
          active: true,
          selectedTransactionDate: '2023-10-01T04:00:00.000Z',
        }),
      )
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body.nextTransactionDate).toBe('2024-10-01T04:00:00.000Z');
    expect(response.body.active).toBe(true);
  });
});
