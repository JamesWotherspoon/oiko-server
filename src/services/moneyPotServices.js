const MoneyPot = require('../models/MoneyPotModel');
const Transaction = require('../models/TransactionModel');
const sequelize = require('../config/dbConfig');

const retrieve = async (userId) => {
  try {
    const whereClause = { userId };
    const orderClause = [
      ['name', 'DESC'],
      ['id', 'DESC'],
    ];

    return await MoneyPot.findAll({ where: whereClause, order: orderClause });
  } catch (error) {
    const enhancedError = new Error(
      `Failed to retrieve money pots in moneyPotService. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const retrieveById = async (userId, id) => {
  try {
    return await MoneyPot.findOne({ where: { userId, id } });
  } catch (error) {
    const enhancedError = new Error(
      `Failed to retrieve money pot in moneyPotService. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const create = async (userId, moneyPotData) => {
  try {
    return await MoneyPot.create({ userId, ...moneyPotData });
  } catch (error) {
    const enhancedError = new Error(`Failed to create money pot in moneyPotService. Original error: ${error.message}`);
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const update = async (userId, id, moneyPotData) => {
  try {
    const whereClause = { userId, id };
    const moneyPot = await MoneyPot.update(moneyPotData, { where: whereClause });
    return moneyPot;
  } catch (error) {
    const enhancedError = new Error(`Failed to update money pot in moneyPotService. Original error: ${error.message}`);
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const destroy = async (userId, id) => {
  try {
    const whereClause = { userId, id };
    const moneyPot = await MoneyPot.destroy({ where: whereClause });
    return moneyPot;
  } catch (error) {
    const enhancedError = new Error(`Failed to delete money pot in moneyPotService. Original error: ${error.message}`);
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
};

const transfer = async (userId, { amount, fromPotId, toPotId }) => {
  await sequelize
    .transaction(async (t) => {
      const sourcePot = await MoneyPot.findByPk(fromPotId, { transaction: t });
      const destPot = await MoneyPot.findByPk(toPotId, { transaction: t });

      if (!sourcePot || !destPot) {
        throw new Error('Invalid source or destination pot.');
      }
      if (sourcePot.balance < amount) {
        throw new Error('Insufficient funds.');
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
    })
    .catch(() => {
      throw new Error(`Failed to execute transfer with error ${error.message}`);
    });
  await updateBalance({ amount, moneyPotId: toPotId, transactionType: 'income' }, 'create');
  await updateBalance({ amount, moneyPotId: fromPotId, transactionType: 'expense' }, 'create');
  return true;
};

const updateBalance = async (transaction, operation, previousTransaction) => {
  try {
    if (!transaction.moneyPotId) return;
    const pot = await MoneyPot.findByPk(transaction.moneyPotId);
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
      // If transaction type is changed, then we need to adjust the logic to determine adjustment
      if (transaction.transactionType !== previousTransaction.transactionType) {
        adjustment = isExpense ? -previousAmount - amount : amount + previousAmount;
      } else {
        adjustment = isExpense ? previousAmount - amount : amount - previousAmount;
      }
      pot.balance = balance + adjustment;
    } else {
      throw new Error(`Invalid type: ${operation} or ${transaction.transactionType}`);
    }

    await pot.save();
  } catch (error) {
    throw new Error(`Failed to execute update Money pot total with error ${error.message}`);
  }
};

module.exports = {
  retrieve,
  retrieveById,
  create,
  update,
  destroy,
  transfer,
  updateBalance,
};
