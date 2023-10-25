const MoneyPot = require('../../../src/models/MoneyPotModel');
const Transaction = require('../../../src/models/TransactionModel');
const { createUserAndLogin, deleteUser } = require('../../testHelpers');

describe('MoneyPot test routes', () => {
  let agent;
  let user;
  let moneyPot;
  let transactionData;
  const date = new Date().toISOString().slice(0, 10);

  beforeEach(async () => {
    ({ agent, user } = await createUserAndLogin());
    moneyPot = await MoneyPot.create({
      userId: user.id,
      name: 'My MoneyPot #1',
      balance: 1000,
    });
    const transaction = await agent.post('/api/transactions').send({
      transactionType: 'income',
      amount: 1000,
      description: 'Test Description',
      transactionDate: date,
      moneyPotId: moneyPot.id,
    });
    transactionData = transaction.body;
    expect(transaction.statusCode).toEqual(201);
    moneyPot = await MoneyPot.findByPk(moneyPot.id);
    expect(moneyPot.balance).toBe('2000.00');
  });
  afterEach(async () => {
    // Use helper to delete user
    await MoneyPot.destroy({
      where: { userId: user.id },
    });
    await Transaction.destroy({
      where: { userId: user.id },
    });
  });

  afterAll(async () => {
    await deleteUser(user.id);
  });

  it('should create transaction then update moneyPot balance', async () => {
    const response = await agent.post('/api/transactions').send({
      transactionType: 'income',
      amount: 100.01,
      description: 'Test Description',
      transactionDate: date,
      moneyPotId: moneyPot.id,
    });
    expect(response.statusCode).toEqual(201);

    const updatedMoneyPot = await MoneyPot.findByPk(moneyPot.id);
    expect(updatedMoneyPot.balance).toBe('2100.01');
  });
  it('should update a transaction amount then update moneyPot balance', async () => {
    const prePot = await MoneyPot.findByPk(moneyPot.id);
    expect(prePot.balance).toBe('2000.00');
    const response = await agent.put(`/api/transactions/${transactionData.id}`).send({
      transactionType: 'income',
      amount: 100.99,
      description: 'Test Description',
      transactionDate: date,
      moneyPotId: moneyPot.id,
    });
    expect(response.statusCode).toBe(200);
    const updatedMoneyPot = await MoneyPot.findByPk(moneyPot.id);
    expect(updatedMoneyPot.balance).toBe('1100.99');
  });

  it('should update a transaction type then update moneyPot balance', async () => {
    const response = await agent.put(`/api/transactions/${transactionData.id}`).send({
      transactionType: 'expense',
      amount: 1000,
      description: 'Test Description',
      transactionDate: date,
      moneyPotId: moneyPot.id,
    });
    expect(response.statusCode).toBe(200);
    const updatedMoneyPot = await MoneyPot.findByPk(moneyPot.id);
    expect(updatedMoneyPot.balance).toBe('0.00');
  });

  it('should delete a transaction then update moneyPot balance', async () => {
    const response = await agent.delete(`/api/transactions/${transactionData.id}`);
    expect(response.statusCode).toBe(200);
    const updatedMoneyPot = await MoneyPot.findByPk(moneyPot.id);
    expect(updatedMoneyPot.balance).toBe('1000.00');
  });
});
