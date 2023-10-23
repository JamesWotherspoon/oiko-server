const MoneyPot = require('../models/MoneyPotModel');
const Transaction = require('../models/TransactionModel');
const sequelize = require('../config/dbConfig');

const retrieveMoneyPots = async (userId) => {
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

const executeMoneyPotTransfer = async (userId, { amount, fromPotId, toPotId }) => {
  const transfer = await sequelize
    .transaction(async (t) => {
      const sourcePot = await MoneyPot.findByPk(fromPotId, { transaction: t });
      const destPot = await MoneyPot.findByPk(toPotId, { transaction: t });
      if (!sourcePot || !destPot) {
        throw new Error('Invalid source or destination pot.');
      }
      if (sourcePot.balance < amount) {
        throw new Error('Insufficient funds.');
      }
      await Transaction.create(
        { userId, amount, transactionType: 'expense', potId: fromPotId },
        { transaction: t },
      );
      await Transaction.create(
        { userId, amount, transactionType: 'income', potId: toPotId },
        { transaction: t },
      );
    })
    .catch((error) => {
      throw new Error(`Failed to execute transfer with error ${error.message}`);
    });

  transfer.success = true;
  return transfer;
};

// Call function if transaction contains moneyPot Id
const updateMoneyPotTotal = async (potId) => {
  try {
    const transactionsForPotId = await Transaction.findAll({ where: { potId } });

    const total = transactionsForPotId.reduce((potBalance, transaction) => {
      if (transaction.transactionType === 'income') {
        return potBalance + transaction.amount;
      } else if (transaction.transactionType === 'expense') {
        return potBalance - transaction.amount;
      } else {
        throw new Error(`Invalid transaction type: ${transaction.transactionType}`);
      }
    }, 0);

    const pot = await MoneyPot.findByPk(potId);
    pot.balance = total;
    await pot.save();

    return total;
  } catch (error) {
    throw new Error(`Failed to execute update Money pot total with error ${error.message}`);
  }
};

module.exports = {
  retrieveMoneyPots,
  executeMoneyPotTransfer,
  updateMoneyPotTotal,
};
