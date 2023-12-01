const MoneyPot = require('../models/MoneyPotModel');
const Transaction = require('../models/TransactionModel');
const sequelize = require('../config/dbConfig');
const { NotFoundError, InternalServerError } = require('../utils/customErrorUtils');

const retrieve = async (userId) => {
  const whereClause = { userId };
  const orderClause = [
    ['name', 'DESC'],
    ['id', 'DESC'],
  ];
  const moneyPots = await MoneyPot.findAll({ where: whereClause, order: orderClause });

  return moneyPots;
};

const retrieveById = async (userId, id) => {
  const moneyPot = await MoneyPot.findOne({ where: { userId, id } });

  if (!moneyPot) {
    throw new NotFoundError(`Money pot with ID: ${id} not found.`, 'NOT_FOUND');
  }
  return moneyPot;
};

const create = async (userId, moneyPotData) => {
  const moneyPot = await MoneyPot.create({ userId, ...moneyPotData });
  return moneyPot;
};

const updateById = async (userId, id, moneyPotData) => {
  const whereClause = { userId, id };
  const updated = await MoneyPot.update(moneyPotData, { where: whereClause });

  if (!updated || updated[0] === 0) {
    throw new NotFoundError(`Failed to update money pot with ID: ${id}`, 'UPDATE_FAILED');
  }
  const updatedItem = await MoneyPot.findOne({ where: whereClause });

  return updatedItem;
};

const deleteById = async (userId, id) => {
  const whereClause = { userId, id };
  const deleted = await MoneyPot.destroy({ where: whereClause });

  if (!deleted) {
    throw new NotFoundError(`Failed to delete money pot with ID: ${id}`, 'DELETE_FAILED');
  }

  return id;
};

const transfer = async (userId, { amount, fromPotId, toPotId }) => {
  await sequelize.transaction(async (t) => {
    const sourcePot = await MoneyPot.findByPk(fromPotId, { transaction: t });
    const destPot = await MoneyPot.findByPk(toPotId, { transaction: t });

    if (!sourcePot || !destPot) {
      throw new NotFoundError('Invalid source or destination pot.', 'INVALID_POT');
    }

    const date = new Date();

    await Transaction.create(
      {
        userId,
        amount,
        transactionType: 'expense',
        moneyPotId: fromPotId,
        transactionDate: date,
      },
      { transaction: t },
    );

    await Transaction.create(
      { userId, amount, transactionType: 'income', moneyPotId: toPotId, transactionDate: date },
      { transaction: t },
    );
  });

  await updateBalance({ amount, moneyPotId: toPotId, transactionType: 'income' }, 'create');
  await updateBalance({ amount, moneyPotId: fromPotId, transactionType: 'expense' }, 'create');

  return true;
};

const updateBalance = async (transaction, operation, previousTransaction) => {
  if (!transaction.moneyPotId) return;
  const pot = await MoneyPot.findByPk(transaction.moneyPotId);

  if (!pot) {
    throw new NotFoundError(`Money pot with ID: ${transaction.moneyPotId} not found.`, 'NOT_FOUND');
  }
  const amount = Number(transaction.amount);
  const balance = Number(pot.balance);
  let signedBalance = pot.balanceType === 'positive' ? balance : -balance;

  const isExpense = transaction.transactionType === 'negative';
  const isIncome = transaction.transactionType === 'positive';
  const isCreate = operation === 'create';
  const isDestroy = operation === 'destroy';
  const isUpdate = operation === 'update';

  if (isCreate || isDestroy) {
    if ((isExpense && isDestroy) || (isIncome && isCreate)) {
      console.log(signedBalance, amount);
      signedBalance = signedBalance + amount;
    } else {
      signedBalance = signedBalance - amount;
    }
  } else if (isUpdate) {
    const previousAmount = Number(previousTransaction.amount);
    let adjustment;

    if (transaction.transactionType !== previousTransaction.transactionType) {
      adjustment = isExpense ? -previousAmount - amount : amount + previousAmount;
    } else {
      adjustment = isExpense ? previousAmount - amount : amount - previousAmount;
    }
    signedBalance = signedBalance + adjustment;
  } else {
    throw new InternalServerError(`Invalid type: ${operation} or ${transaction.transactionType}`, 'UPDATE_FAILED');
  }

  if (signedBalance < 0) {
    pot.balanceType = 'negative';
  } else if (signedBalance > 0) {
    pot.balanceType = 'positive';
  }
  pot.balance = Math.abs(signedBalance);
  await pot.save();
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  updateById,
  deleteById,
  transfer,
  updateBalance,
};
