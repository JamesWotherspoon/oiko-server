const ScheduledTransaction = require('../../models/ScheduledTransactionModel');
const Category = require('../../models/CategoryModel');
const MoneyPot = require('../../models/MoneyPotModel');
const { Op, literal } = require('sequelize');
const getNextTransactionDate = require('./getNextTransactionDate');

const joinStatment = [
  {
    model: MoneyPot,
    attributes: ['name'],
    where: { moneyPotId: literal('`ScheduledTransaction`.`moneyPotId`') },
    required: true,
  },
  {
    model: Category,
    attributes: ['iconIdentifier', 'color'],
    where: { categoryId: literal('`ScheduledTransaction`.`categoryId`') },
    required: false,
  },
];

const retrieve = async (
  userId,
  { scheduledActionId, transactionType, name, minAmount, maxAmount, recurrenceType, categoryId },
) => {
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

  return await ScheduledTransaction.findAll({
    where: whereClause,
    order: orderClause,
    include: joinStatment,
  });
};

const retrieveById = async (userId, id) => {
  const whereClause = { userId, id };

  return await ScheduledTransaction.findOne({ where: whereClause, include: joinStatment });
};

const create = async (userId, scheduledActionData) => {
  scheduledActionData.nextTransactionDate = getNextTransactionDate(scheduledActionData);

  return await ScheduledTransaction.create({ userId, ...scheduledActionData });
};

const updateById = async (userId, id, scheduledActionData) => {
  const whereClause = { userId, id };

  await ScheduledTransaction.update(scheduledActionData, {
    where: whereClause,
  });

  const updatedItem = await ScheduledTransaction.findOne({ where: whereClause });

  return updatedItem;
};

const deleteById = async (userId, id) => {
  const whereClause = { userId, id };

  await ScheduledTransaction.destroy({ where: whereClause });

  return id;
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
};
