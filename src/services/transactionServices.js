const Transaction = require('../models/TransactionModel');
const moneyPotServices = require('../services/moneyPotServices');
const { Op } = require('sequelize');

const retrieve = async (userId, query) => {
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
    const enhancedError = new Error(
      `Failed to retrieve transactions in transactionServices. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const retrieveById = async (userId, id) => {
  try {
    const whereClause = { id: id, userId: userId };
    return await Transaction.findOne({ where: whereClause });
  } catch (error) {
    const enhancedError = new Error(
      `Failed to retrieve transaction in transactionServices. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const create = async (userId, transactionData) => {
  try {
    const transaction = await Transaction.create({ userId, ...transactionData });
    await moneyPotServices.updateBalance(transaction, 'create');
    return transaction;
  } catch (error) {
    const enhancedError = new Error(
      `Failed to create transaction in transactionServices. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const update = async (userId, transactionId, transactionData) => {
  try {
    const whereClause = { userId, id: transactionId };
    const previousTransaction = await Transaction.findOne({ where: whereClause });
    const updated = await Transaction.update(transactionData, { where: whereClause });
    await moneyPotServices.updateBalance(transactionData, 'update', previousTransaction);
    return updated;
  } catch (error) {
    const enhancedError = new Error(
      `Failed to update transaction in transactionServices. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const destroy = async (userId, transactionId) => {
  try {
    const transaction = await Transaction.findOne({ where: { userId, id: transactionId } });
    const whereClause = { userId: userId, id: transactionId };
    await Transaction.destroy({ where: whereClause });
    await moneyPotServices.updateBalance(transaction, 'destroy');
    return true;
  } catch (error) {
    const enhancedError = new Error(
      `Failed to delete transaction in transactionServices. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  update,
  destroy,
};
