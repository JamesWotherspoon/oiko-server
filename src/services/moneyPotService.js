const MoneyPot = require('../models/MoneyPotModel');
const Transaction = require('../models/TransactionModel');
const sequelize = require('../config/dbConfig');
const { NotFoundError, InternalServerError, DomainError } = require('../utils/customErrorUtils');

const retrieve = async (userId) => {
  try {
    const whereClause = { userId };
    const orderClause = [
      ['name', 'DESC'],
      ['id', 'DESC'],
    ];
    const moneyPots = await MoneyPot.findAll({ where: whereClause, order: orderClause });

    return moneyPots;
  } catch (error) {
    next(error);
  }
};

const retrieveById = async (userId, id) => {
  try {
    const moneyPot = await MoneyPot.findOne({ where: { userId, id } });

    if (!moneyPot) {
      throw new NotFoundError(`Money pot with ID: ${id} not found.`, 'NOT_FOUND');
    }
    return moneyPot;
  } catch (error) {
    next(error);
  }
};

const create = async (userId, moneyPotData) => {
  try {
    const moneyPot = await MoneyPot.create({ userId, ...moneyPotData });
    return moneyPot;
  } catch (error) {
    next(error);
  }
};

const updateById = async (userId, id, moneyPotData) => {
  try {
    const whereClause = { userId, id };
    const updated = await MoneyPot.update(moneyPotData, { where: whereClause });

    if (!updated || updated[0] === 0) {
      throw new NotFoundError(`Failed to update money pot with ID: ${id}`, 'UPDATE_FAILED');
    }

    return updated;
  } catch (error) {
    next(error);
  }
};

const deleteById = async (userId, id) => {
  try {
    const whereClause = { userId, id };
    const deleted = await MoneyPot.destroy({ where: whereClause });

    if (!deleted) {
      throw new NotFoundError(`Failed to delete money pot with ID: ${id}`, 'DELETE_FAILED');
    }

    return deleted;
  } catch (error) {
    next(error);
  }
};

const transfer = async (userId, { amount, fromPotId, toPotId }) => {
  try {
    await sequelize.transaction(async (t) => {
      const sourcePot = await MoneyPot.findByPk(fromPotId, { transaction: t });
      const destPot = await MoneyPot.findByPk(toPotId, { transaction: t });

      if (!sourcePot || !destPot) {
        throw new NotFoundError('Invalid source or destination pot.', 'INVALID_POT');
      }

      if (sourcePot.balance < amount) {
        throw new DomainError('Insufficient funds.', 'INSUFFICIENT_FUNDS');
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
  } catch (error) {
    next(error);
  }
};

const updateBalance = async (transaction, operation, previousTransaction) => {
  try {
    if (!transaction.moneyPotId) return;

    const pot = await MoneyPot.findByPk(transaction.moneyPotId);

    if (!pot) {
      throw new NotFoundError(`Money pot with ID: ${transaction.moneyPotId} not found.`, 'NOT_FOUND');
    }

    const amount = Number(transaction.amount);
    const balance = Number(pot.balance);

    const isExpense = transaction.transactionType === 'expense';
    const isIncome = transaction.transactionType === 'income';
    const isCreate = operation === 'create';
    const isDestroy = operation === 'destroy';
    const isUpdate = operation === 'update';

    if (isCreate || isDestroy) {
      if ((isExpense && isDestroy) || (isIncome && isCreate)) {
        pot.balance = balance + amount;
      } else {
        pot.balance = balance - amount;
      }
    } else if (isUpdate) {
      const previousAmount = Number(previousTransaction.amount);
      let adjustment;

      if (transaction.transactionType !== previousTransaction.transactionType) {
        adjustment = isExpense ? -previousAmount - amount : amount + previousAmount;
      } else {
        adjustment = isExpense ? previousAmount - amount : amount - previousAmount;
      }
      pot.balance = balance + adjustment;
    } else {
      throw new InternalServerError(`Invalid type: ${operation} or ${transaction.transactionType}`, 'UPDATE_FAILED');
    }

    await pot.save();
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
  transfer,
  updateBalance,
};
