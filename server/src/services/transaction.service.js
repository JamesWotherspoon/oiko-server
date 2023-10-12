const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const getTransactions = async (userId, categoryId, range) => {
  const whereClause = categoryId ? { userId, categoryId } : { userId };
  if (range) {
    const [from, to] = range.split(',');
    whereClause.transactionDate = {
      [Op.between]: [new Date(from), new Date(to)],
    };
  }
  return await Transaction.findAll({ where: whereClause });
};

module.exports = {
  getTransactions,
};
