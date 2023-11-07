const scheduledTransactionService = require('../services/scheduledTransaction/scheduledTransactionService');

const getScheduledTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = req.query;

    const scheduledTransactions = await scheduledTransactionService.retrieve(userId, query);

    res.status(200).json(scheduledTransactions);
  } catch (error) {
    next(error);
  }
};

// Fetch a specific scheduled transaction by ID
const getScheduledTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const scheduledTransaction = await scheduledTransactionService.retrieveById(userId, id);

    res.status(200).json(scheduledTransaction);
  } catch (error) {
    next(error);
  }
};

const createScheduledTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const scheduledTransactionData = req.body;

    const scheduledTransaction = await scheduledTransactionService.create(userId, scheduledTransactionData);

    res.status(201).json(scheduledTransaction);
  } catch (error) {
    next(error);
  }
};

// Update a scheduled transaction by ID
const updateScheduledTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const scheduledActionData = req.body;

    const updatedItem = await scheduledTransactionService.updateById(userId, id, scheduledActionData);

    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

// Delete a scheduled transaction by ID
const deleteScheduledTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await scheduledTransactionService.deleteById(userId, id);

    res.status(200).json(id);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScheduledTransactions,
  getScheduledTransactionById,
  createScheduledTransaction,
  updateScheduledTransactionById,
  deleteScheduledTransactionById,
};
