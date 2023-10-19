const { Op } = require('sequelize');
const ScheduledTransaction = require('../../models/ScheduledTransactionModel');
const Transaction = require('../../models/TransactionModel');
const { scheduledTransactionLogger } = require('../../utils/loggerUtils');
const getNextTransactionDate = require('./getNextTransactionDate');

async function createTransactionsForToday() {
  try {
    // Get today's date without time part
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayEnd = new Date(todayStart);
    todayEnd.setUTCHours(23, 59, 59, 999);

    // Find all scheduled transactions for today's date and active status
    const scheduledTransactions = await ScheduledTransaction.findAll({
      where: {
        nextTransactionDate: {
          [Op.gte]: todayStart,
          [Op.lte]: todayEnd,
        },
        active: true,
      },
    });
    // For each scheduled transaction, create a new Transaction entity
    for (const scheduledTransaction of scheduledTransactions) {
      const transaction = await Transaction.create({
        userId: scheduledTransaction.userId,
        categoryId: scheduledTransaction.categoryId,
        scheduledTransactionId: scheduledTransaction.id,
        transactionType: scheduledTransaction.transactionType,
        name: scheduledTransaction.name,
        amount: scheduledTransaction.amount,
        transactionDate: scheduledTransaction.nextTransactionDate,
        description: scheduledTransaction.description,
      });
      // Update the scheduled transaction's next transaction date
      const { recurrenceType, dayOfWeek, dateOfMonth, monthOfYear, selectedTransactionDate } = scheduledTransaction;
      const nextTransactionDate = getNextTransactionDate(
        recurrenceType,
        dayOfWeek,
        dateOfMonth,
        monthOfYear,
        selectedTransactionDate,
      );
      await Transaction.update(
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
