const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const retrieveTransactions = async (userId, query) => {
  const {
    from,
    to,
    categoryId,
    scheduledTransactionId,
    transactionType,
    name,
    minAmount,
    maxAmount,
    description,
    sortField,
    sortOrder,
  } = query;

  const whereClause = { userId };
  const orderClause = [];

  if (categoryId) whereClause.categoryId = categoryId;
  if (from && to) whereClause.transactionDate = { [Op.between]: [new Date(from), new Date(to)] };
  if (scheduledTransactionId) whereClause.scheduledTransactionId = scheduledTransactionId;
  if (transactionType) whereClause.transactionType = transactionType;
  if (name) whereClause.name = { [Op.like]: '%' + name + '%' };
  if (description) whereClause.description = { [Op.like]: '%' + description + '%' };
  if (minAmount) whereClause.amount = { ...whereClause.amount, [Op.gte]: minAmount };
  if (maxAmount) whereClause.amount = { ...whereClause.amount, [Op.lte]: maxAmount };
  if (sortField) orderClause.push([sortField, sortOrder === 'desc' ? 'DESC' : 'ASC']);
  if (sortField !== 'transactionDate') orderClause.push(['transactionDate', 'ASC']);

  return await Transaction.findAll({ where: whereClause, order: orderClause });
};

module.exports = {
  retrieveTransactions,
};
