const transactionService = require('../services/transactionService');

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = req.query;

    const transactions = await transactionService.retrieve(userId, query);

    if (transactions.length !== 0) {
      res.status(200).json(transactions);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed fetching transactions. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Fetch a specific transaction by ID
const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await transactionService.retrieveById(userId, id);

    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed fetching transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    next(enhancedError);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionData = req.body;

    const transaction = await transactionService.create(userId, transactionData);

    res.status(201).json(transaction);
  } catch (error) {
    const enhancedError = new Error(`Failed creating transaction. Original error: ${error.message}`);
    enhancedError.stack = error.stack;
    next(enhancedError);
  }
};

// Update a transaction by ID
const updateTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const transactionData = req.body;

    const transaction = await transactionService.updateById(userId, id, transactionData);

    if (transaction.length) {
      res.status(200).json({ updated: true });
    } else {
      res.status(404).json({ updated: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed updating transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Delete a transaction by ID
const deleteTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await transactionService.deleteById(userId, id);

    if (deleted) {
      res.status(200).json({ deleted: true });
    } else {
      res.status(404).json({ deleted: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed deleting transaction with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
};
