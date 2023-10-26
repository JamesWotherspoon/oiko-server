const { Op } = require('sequelize');
const ScheduledTransaction = require('../../models/ScheduledTransactionModel');
const Transaction = require('../../models/TransactionModel');
const { scheduledTransactionLogger } = require('../../utils/loggerUtils');
const getNextTransactionDate = require('./getNextTransactionDate');

async function createTransactionsForToday() {
  try {
    // Get today's date without time part
    const todayStart = new Date().setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart).setUTCHours(23, 59, 59, 999);

    // Find all scheduled transactions for today's date and active status
    const scheduledTransactions = await ScheduledTransaction.findAll({
      where: {
        nextTransactionDate: { [Op.gte]: todayStart, [Op.lte]: todayEnd },
        active: true,
      },
    });
    // For each scheduled transaction, create a new Transaction entity
    for (const scheduledTransaction of scheduledTransactions) {
      const { userId, categoryId, id, transactionType, name, amount, description } = scheduledTransaction;

      const transaction = await Transaction.create({
        userId,
        categoryId,
        scheduledTransactionId: id,
        transactionType,
        name,
        amount,
        transactionDate: todayStart,
        description,
      });

      const nextTransactionDate = await getNextTransactionDate( { scheduledTransaction } );
      await scheduledTransaction.update(
        { nextTransactionDate },
        {
          where: { id: scheduledTransaction.id },
        },
      );
      // Log transaction creation
      scheduledTransactionLogger.info(
        `Created transaction for scheduled transaction id ${scheduledTransaction.id} 
        with transaction id ${transaction.id}`,
      );
    }
  } catch (error) {
    scheduledTransactionLogger.error(`Error in auto creating transactions for today: ${error.message}`);
  }
}

module.exports = createTransactionsForToday;
