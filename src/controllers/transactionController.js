const transactionServices = require('../services/transactionServices');

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionServices.retrieve(req.user.id, req.query);

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
    const transaction = await transactionServices.retrieveById(req.user.id, req.params.id);
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
    const transaction = await transactionServices.create(req.user.id, req.body);
    res.status(201).json(transaction);
  } catch (error) {
    const enhancedError = new Error(
      `Failed creating transaction. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    next(enhancedError);
  }
};

// Update a transaction by ID
const updateTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionServices.update(req.user.id, req.params.id, req.body);

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
    const deleted = await transactionServices.destroy(req.user.id, req.params.id);

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
