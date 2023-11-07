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
    next(error);
  }
};

const retrieveById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    return await ScheduledTransaction.findOne({ where: whereClause });
  } catch (error) {
    next(error);
  }
};

const create = async (userId, scheduledActionData) => {
  try {
    scheduledActionData.nextTransactionDate = getNextTransactionDate(scheduledActionData);

    return await ScheduledTransaction.create({ userId, ...scheduledActionData });
  } catch (error) {
    next(error);
  }
};

const updateById = async (userId, id, scheduledActionData) => {
  try {
    const whereClause = { userId, id };

    await ScheduledTransaction.update(scheduledActionData, {
      where: whereClause,
    });

    const updatedItem = await ScheduledTransaction.findOne({ where: whereClause });

    return updatedItem;
  } catch (error) {
    next(error);
  }
};

const deleteById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    await ScheduledTransaction.destroy({ where: whereClause });

    return id;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
};
