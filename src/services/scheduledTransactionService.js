const ScheduledTransaction = require('../models/ScheduledTransactionModel');
const { Op, literal } = require('sequelize');

const retrieveScheduledTransactions = async (userId, query) => {
  try {
    const { categoryId, transactionType, name, minAmount, maxAmount, recurrenceType } = query;

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
    next(error);
  }
};

module.exports = {
  retrieveScheduledTransactions,
};
