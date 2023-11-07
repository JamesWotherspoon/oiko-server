const transactionService = require('../services/transactionService');

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const query = req.query;

    const transactions = await transactionService.retrieve(userId, query);

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

// Fetch a specific transaction by ID
const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const transaction = await transactionService.retrieveById(userId, id);

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionData = req.body;

    const transaction = await transactionService.create(userId, transactionData);

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Update a transaction by ID
const updateTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const transactionData = req.body;

    const updatedItem = await transactionService.updateById(userId, id, transactionData);

    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

// Delete a transaction by ID
const deleteTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await transactionService.deleteById(userId, id);

    res.status(200).json(id);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
};
