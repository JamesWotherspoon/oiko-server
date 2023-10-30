const Transaction = require('../models/TransactionModel');
const moneyPotService = require('./moneyPotService');
const { Op } = require('sequelize');
const { NotFoundError, DomainError } = require('../utils/customErrorUtils');

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

    const transactions = await Transaction.findAll({
      where: whereClause,
      order: orderClause,
      offset: offset,
      limit: pageSize,
    });

    return transactions;
  } catch (error) {
    next(error);
  }
};

const retrieveById = async (userId, id) => {
  try {
    const whereClause = { userId, id };

    const transaction = await Transaction.findOne({ where: whereClause });

    if (!transaction) {
      throw new NotFoundError(`Transaction with ID: ${id} not found.`, 'NOT_FOUND');
    }

    return transaction;
  } catch (error) {
    next(error);
  }
};

const create = async (userId, transactionData) => {
  try {
    const moneyPot = moneyPotService.retrieveById(userId, transactionData.moneyPotId);
    const isExpense = transactionData.transactionType === 'Expense';
    if (isExpense && moneyPot.balance < amount) {
      throw new DomainError('Insufficient funds.', 'INSUFFICIENT_FUNDS');
    }
    const transaction = await Transaction.create({ userId, ...transactionData });
    await moneyPotService.updateBalance(transaction, 'create');
    return transaction;
  } catch (error) {
    next(error);
  }
};

const updateById = async (userId, transactionId, transactionData) => {
  try {
    const moneyPot = moneyPotService.retrieveById(userId, transactionData.moneyPotId);
    const isExpense = transactionData.transactionType === 'Expense';
    if (isExpense && moneyPot.balance < amount) {
      throw new DomainError('Insufficient funds.', 'INSUFFICIENT_FUNDS');
    }

    const whereClause = { userId, id: transactionId };
    const previousTransaction = await Transaction.findOne({ where: whereClause });
    const updated = await Transaction.update(transactionData, { where: whereClause });
    await moneyPotService.updateBalance(transactionData, 'update', previousTransaction);
    return updated;
  } catch (error) {
    next(error);
  }
};

const deleteById = async (userId, transactionId) => {
  try {
    const transaction = await Transaction.findOne({ where: { userId, id: transactionId } });
    const whereClause = { userId: userId, id: transactionId };
    await Transaction.destroy({ where: whereClause });
    await moneyPotService.updateBalance(transaction, 'destroy');
    return true;
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
