const scheduledTransactionService = require('../services/scheduledTransaction/scheduledTransactionService');

const getScheduledTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = req.query;

    const scheduledTransactions = await scheduledTransactionService.retrieve(userId, query);

    if (scheduledTransactions.length !== 0) {
      res.status(200).json(scheduledTransactions);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed fetching scheduled transactions. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Fetch a specific scheduled transaction by ID
const getScheduledTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const scheduledTransaction = await scheduledTransactionService.retrieveById(userId, id);

    if (scheduledTransaction) {
      res.status(200).json(scheduledTransaction);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed fetching scheduled transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    next(enhancedError);
  }
};

const createScheduledTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const scheduledTransactionData = req.body;

    const scheduledTransaction = await scheduledTransactionService.create(userId, scheduledTransactionData);

    res.status(201).json(scheduledTransaction);
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed creating scheduled transaction. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Update a scheduled transaction by ID
const updateScheduledTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const scheduledActionData = req.body;

    const updated = await scheduledTransactionService.updateById(userId, id, scheduledActionData);

    if (updated.length) {
      res.status(200).json({ updated: true });
    } else {
      res.status(404).json({ updated: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed updating scheduled transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Delete a scheduled transaction by ID
const deleteScheduledTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await scheduledTransactionService.deleteById(userId, id);

    if (deleted) {
      res.status(200).json({ deleted: true });
    } else {
      res.status(404).json({ deleted: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed deleting scheduled transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

module.exports = {
  getScheduledTransactions,
  getScheduledTransactionById,
  createScheduledTransaction,
  updateScheduledTransactionById,
  deleteScheduledTransactionById,
};
