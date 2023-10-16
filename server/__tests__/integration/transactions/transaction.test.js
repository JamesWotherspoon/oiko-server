const Transaction = require('../../../src/models/Transaction');
const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('Transaction route tests', () => {
  let agent;
  let user;
  const date = new Date().toISOString().slice(0, 10);

  beforeAll(async () => {
    // Use helper to create user and login
    ({ agent, user } = await createUserAndLogin());
  });

  afterAll(async () => {
    // Use helper to delete user
    await deleteUser(user.id);
  });

  afterEach(async () => {
    // Delete all transactions from the database
    await Transaction.destroy({
      where: { userId: user.id },
    });
  });

  test('Should get all user transactions from the database', async () => {
    await Transaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      transactionDate: date,
    });

    const response = await agent.get('/api/transactions');
    expect(response.status).toBe(200);
    expect(response.body[0].userId).toBe(user.id);
    expect(response.body[0].transactionType).toBe('income');
    expect(Number(response.body[0].amount)).toBe(100);
  });

  test('Should get a single transaction from database', async () => {
    // Create a transaction to retrieve
    const transaction = await Transaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      description: 'Test Description',
      transactionDate: date,
    });
    // Create a second transaction to ensure that the correct transaction is returned
    await Transaction.create({
      userId: user.id,
      transactionType: 'expense',
      amount: 69,
      description: 'Nice',
      transactionDate: date,
    });
    const response = await agent.get(`/api/transactions/${transaction.id}`);

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(user.id);
    expect(response.body.transactionType).toBe('income');
    expect(Number(response.body.amount)).toBe(transaction.amount);
    expect(response.body.id).toBe(transaction.id);
  });

  test('Should add a new transaction to database', async () => {
    const transactionAmount = 147.87;
    const response = await agent
      .post('/api/transactions')
      .send(
        JSON.stringify({
          transactionType: 'expense',
          name: 'Test Expense',
          amount: transactionAmount,
          description: 'Test Description',
          transactionDate: date,
        }),
      )
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);

    const transaction = await Transaction.findOne({
      where: { id: response.body.id },
    });

    expect(transaction.userId).toBe(user.id);
    expect(Number(transaction.amount)).toBe(transactionAmount);
    expect(transaction.transactionType).toBe('expense');
  });

  test('Should update a transaction in the database', async () => {
    const transaction = await Transaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      description: 'Test Description',
      transactionDate: date,
    });

    const updatedTransactionAmount = 147.87;
    const response = await agent
      .put(`/api/transactions/${transaction.id}`)
      .send(
        JSON.stringify({
          userId: user.id,
          name: 'Test Expense',
          amount: updatedTransactionAmount,
          description: 'Test Description',
          transactionDate: date,
        }),
      )
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    const updatedTransaction = await Transaction.findOne({
      where: { id: response.body.id },
    });

    expect(updatedTransaction.userId).toBe(user.id);
    expect(Number(updatedTransaction.amount)).toBe(updatedTransactionAmount);
    expect(updatedTransaction.name).toBe('Test Expense');
  });
  test('Should delete a transaction from the database', async () => {
    const transaction = await Transaction.create({
      userId: user.id,
      transactionType: 'income',
      amount: 100,
      description: 'Test Description',
      transactionDate: date,
    });

    const response = await agent.delete(`/api/transactions/${transaction.id}`);

    expect(response.status).toBe(200);
    const deletedTransaction = await Transaction.findOne({
      where: { id: transaction.id, userId: user.id },
    });
    expect(deletedTransaction).toBe(null);
  });
});
