const ScheduledTransaction = require('../../models/ScheduledTransactionModel');
const { Op, literal } = require('sequelize');
const getNextTransactionDate = require('./getNextTransactionDate');

const retrieve = async (
  userId,
  { scheduledActionId, transactionType, name, minAmount, maxAmount, recurrenceType, categoryId },
) => {
  try {
    const whereClause = { userId };
    const orderClause = [
      literal(`FIELD(recurrenceType, 'daily', 'weekly', 'monthly', 'quarterly', 'biannually', 'annually')`),
    ];

    if (scheduledActionId) whereClause.scheduledActionId = scheduledActionId;
    if (transactionType) whereClause.transactionType = transactionType;
    if (name) whereClause.name = { [Op.like]: name + '%' };
    if (minAmount) whereClause.amount = { ...whereClause.amount, [Op.gte]: minAmount };
    if (maxAmount) whereClause.amount = { ...whereClause.amount, [Op.lte]: maxAmount };
    if (recurrenceType) whereClause.recurrenceType = recurrenceType;
    if (categoryId) whereClause.categoryId = categoryId;

    return await ScheduledTransaction.findAll({ where: whereClause, order: orderClause });
  } catch (error) {
    const enhancedError = new Error(
      `Failed to retrieve scheduled transactions in services. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const retrieveById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    return await ScheduledTransaction.findOne({ where: whereClause });
  } catch (error) {
    console.error('Error getting transaction:', error);
    throw error;
  }
};

const create = async (userId, scheduledActionData) => {
  try {
    scheduledActionData.nextTransactionDate = getNextTransactionDate(scheduledActionData);

    return await ScheduledTransaction.create({ userId, ...scheduledActionData });
  } catch (error) {
    const enhancedError = new Error(
      `Failed to create scheduled transaction in services. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const updateById = async (userId, id, scheduledActionData) => {
  try {
    const whereClause = { userId, id };

    return await ScheduledTransaction.update(scheduledActionData, {
      where: whereClause,
    });
  } catch (error) {
    console.error('Error updating scheduledAction:', error);
    throw error;
  }
};

const deleteById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    const deleted = await ScheduledTransaction.destroy({ where: whereClause });

    return deleted;
  } catch (error) {
    console.error('Error deleting scheduledAction:', error);
    throw error;
  }
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
};
