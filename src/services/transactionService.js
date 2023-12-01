const Transaction = require('../models/TransactionModel');
const moneyPotService = require('./moneyPotService');
const { Op, literal } = require('sequelize');
const { NotFoundError } = require('../utils/customErrorUtils');
const Category = require('../models/CategoryModel');
const MoneyPot = require('../models/MoneyPotModel');

const joinStatment = [
  {
    model: MoneyPot,
    attributes: ['name'],
    where: { moneyPotId: literal('`Transaction`.`moneyPotId`') },
    required: true,
  },
  {
    model: Category,
    attributes: ['iconIdentifier', 'color'],
    where: { categoryId: literal('`Transaction`.`categoryId`') },
    required: false,
  },
];

const retrieve = async (userId, query) => {
  const {
    from,
    to,
    moneyPotId,
    categoryId,
    scheduledid,
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

  if (moneyPotId) whereClause.moneyPotId = moneyPotId;
  if (categoryId) whereClause.categoryId = categoryId;
  if (from && to) whereClause.transactionDate = { [Op.between]: [new Date(from), new Date(to)] };
  if (scheduledid) whereClause.scheduledid = scheduledid;
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
    include: joinStatment,
  });

  return transactions;
};

const retrieveById = async (userId, id) => {
  const whereClause = { userId, id };

  const transaction = await Transaction.findOne({ where: whereClause, include: joinStatment });

  if (!transaction) {
    throw new NotFoundError(`Transaction with ID: ${id} not found.`, 'NOT_FOUND');
  }

  return transaction;
};

const create = async (userId, transactionData) => {
  console.log(transactionData);
  const transaction = await Transaction.create({ userId, ...transactionData });
  await moneyPotService.updateBalance(transaction, 'create');
  return transaction;
};

const updateById = async (userId, id, transactionData) => {
  const whereClause = { userId, id };
  const previousTransaction = await Transaction.findOne({ where: whereClause });
  await Transaction.update(transactionData, { where: whereClause });
  await moneyPotService.updateBalance(transactionData, 'update', previousTransaction);

  const updatedItem = await Transaction.findOne({ where: whereClause });

  return updatedItem;
};

const deleteById = async (userId, id) => {
  const transaction = await Transaction.findOne({ where: { userId, id } });
  const whereClause = { userId: userId, id };
  await Transaction.destroy({ where: whereClause });
  await moneyPotService.updateBalance(transaction, 'destroy');
  return id;
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
};
