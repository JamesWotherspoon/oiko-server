const createTransactionsForToday = require('../../../src/services/scheduledTransaction/createTransactionsForToday');
const ScheduledTransaction = require('../../../src/models/ScheduledTransactionModel');
const Transaction = require('../../../src/models/TransactionModel');
const { createUserAndLogin, deleteUser, createUserCategory } = require('../../testHelpers');

describe('createTransactionsForToday', () => {
  let user;
  let category;

  beforeAll(async () => {
    ({ user } = await createUserAndLogin());
    category = await createUserCategory(user.id);
  });
  afterEach(async () => {
    await ScheduledTransaction.destroy({ where: { userId: user.id } });
    await Transaction.destroy({ where: { userId: user.id } });
  });

  afterAll(async () => {
    await deleteUser(user.id);
  });

  it('should create transactions for today', async () => {
    // Create a scheduled transaction for today
    const scheduledTransaction = await ScheduledTransaction.create({
      userId: user.id,
      categoryId: category.id,
      transactionType: 'expense',
      name: 'Test Transaction',
      amount: 10,
      recurrenceType: 'daily',
      nextTransactionDate: new Date(),
      active: true,
      description: 'Test Description',
    });
    await ScheduledTransaction.create({
      userId: user.id,
      transactionType: 'income',
      name: 'Test Past Transaction',
      amount: 999,
      recurrenceType: 'daily',
      nextTransactionDate: new Date('2021-08-01T04:00:00.000Z'),
      active: true,
    });

    // Call the function to create transactions for today
    await createTransactionsForToday();

    // Check that a transaction was created for the scheduled transaction
    const transactions = await Transaction.findAll({
      where: {
        userId: user.id,
      },
    });

    expect(transactions).toHaveLength(1);
    expect(transactions[0].scheduledTransactionId).toBe(scheduledTransaction.id);
    expect(transactions[0].categoryId).toBe(scheduledTransaction.categoryId);
    expect(transactions[0].transactionType).toBe(scheduledTransaction.transactionType);
    expect(transactions[0].name).toBe(scheduledTransaction.name);
    expect(Number(transactions[0].amount)).toBe(scheduledTransaction.amount);
    expect(transactions[0].transactionDate).toEqual(
      scheduledTransaction.nextTransactionDate,
    );
    expect(transactions[0].description).toBe(scheduledTransaction.description);
  });
  it('should create no transactions when active set to false', async () => {
    // Create a scheduled transaction for today
    const scheduledTransaction = await ScheduledTransaction.create({
      userId: user.id,
      categoryId: category.id,
      transactionType: 'expense',
      name: 'Test Transaction',
      amount: 10,
      recurrenceType: 'daily',
      nextTransactionDate: new Date(),
      active: false,
      description: 'Test Description',
    });

    // Call the function to create transactions for today
    await createTransactionsForToday();

    // Check that a transaction was created for the scheduled transaction
    const transactions = await Transaction.findAll({
      where: {
        scheduledTransactionId: scheduledTransaction.id,
      },
    });

    expect(transactions).toHaveLength(0);
  });
  it('should set newTransactionDate', async () => {
    // Create a scheduled transaction for today
    const scheduledTransaction = await ScheduledTransaction.create({
      userId: user.id,
      categoryId: category.id,
      transactionType: 'expense',
      name: 'Test Transaction',
      amount: 10,
      recurrenceType: 'daily',
      nextTransactionDate: new Date(),
      active: false,
      description: 'Test Description',
    });

    // Call the function to create transactions for today
    await createTransactionsForToday();

    // Check that a transaction was created for the scheduled transaction
    const transactions = await Transaction.findAll({
      where: {
        scheduledTransactionId: scheduledTransaction.id,
      },
    });

    expect(transactions).toHaveLength(0);
  });
});
