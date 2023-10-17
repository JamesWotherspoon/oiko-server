const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const retrieveTransactions = async (userId, query) => {
  try {
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
      page,
    } = query;

    const whereClause = { userId: userId };
    let orderClause = [];

    if (categoryId) whereClause.categoryId = categoryId;
    if (from && to) whereClause.transactionDate = { [Op.between]: [new Date(from), new Date(to)] };
    if (scheduledTransactionId) whereClause.scheduledTransactionId = scheduledTransactionId;
    if (transactionType) whereClause.transactionType = transactionType;
    if (name) whereClause.name = { [Op.like]: '%' + name + '%' };
    if (description) whereClause.description = { [Op.like]: '%' + description + '%' };
    if (minAmount) whereClause.amount = { ...whereClause.amount, [Op.gte]: minAmount };
    if (maxAmount) whereClause.amount = { ...whereClause.amount, [Op.lte]: maxAmount };

    if (!sortField) {
      orderClause = [
        ['transactionDate', 'DESC'],
        ['id', 'DESC'],
      ];
    } else if (sortField === 'amount') {
      orderClause = [
        [sortField, sortOrder === 'asc' ? 'ASC' : 'DESC'],
        ['transactionDate', 'DESC'],
        ['id', 'DESC'],
      ];
    } else if (sortField === 'transactionDate') {
      orderClause = [
        ['transactionDate', sortOrder === 'asc' ? 'ASC' : 'DESC'],
        ['id', 'DESC'],
      ];
    }

    const pageNum = page || 1;
    const pageSize = 100;
    const offset = (pageNum - 1) * pageSize;

    return await Transaction.findAll({ where: whereClause, order: orderClause, offset: offset, limit: pageSize });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  retrieveTransactions,
};
