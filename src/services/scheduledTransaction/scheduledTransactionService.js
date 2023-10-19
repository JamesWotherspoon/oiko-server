const ScheduledTransaction = require('../../models/ScheduledTransactionModel');
const { Op, literal } = require('sequelize');
const getNextTransactionDate = require('./getNextTransactionDate');

const retrieveScheduledTransactions = async (
  userId,
  categoryId,
  transactionType,
  name,
  minAmount,
  maxAmount,
  recurrenceType,
) => {
  try {
    const whereClause = { userId: userId };
    const orderClause = [
      literal(`FIELD(recurrenceType, 'daily', 'weekly', 'monthly', 'quarterly', 'biannually', 'annually')`),
    ];

    if (categoryId) whereClause.categoryId = categoryId;
    if (transactionType) whereClause.transactionType = transactionType;
    if (name) whereClause.name = { [Op.like]: name + '%' };
    if (minAmount) whereClause.amount = { ...whereClause.amount, [Op.gte]: minAmount };
    if (maxAmount) whereClause.amount = { ...whereClause.amount, [Op.lte]: maxAmount };
    if (recurrenceType) whereClause.recurrenceType = recurrenceType;

    return await ScheduledTransaction.findAll({ where: whereClause, order: orderClause });
  } catch (error) {
    const enhancedError = new Error(
      `Failed to retrieve scheduled transactions in services. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const executeCreateScheduledTransaction = async (createObj) => {
  try {
    const { recurrenceType, dayOfWeek, dateOfMonth, monthOfYear, selectedTransactionDate } = createObj;

    const nextTransactionDate = getNextTransactionDate(
      recurrenceType,
      dayOfWeek,
      dateOfMonth,
      monthOfYear,
      selectedTransactionDate,
    );
    createObj.nextTransactionDate = nextTransactionDate;
    return await ScheduledTransaction.create(createObj);
  } catch (error) {
    const enhancedError = new Error(
      `Failed to create scheduled transaction in services. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

module.exports = {
  retrieveScheduledTransactions,
  executeCreateScheduledTransaction,
};
