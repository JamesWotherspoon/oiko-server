const Transaction = require('../models/Transaction');
const transactionService = require('../services/transaction.service');

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { categoryId, range } = req.query;
    const transactions = await transactionService.getTransactions(userId, categoryId, range);

    if (transactions.length === 0) {
      res.status(204).send();
    } else {
      res.status(200).json(transactions);
    }
  } catch (error) {
    next(error);
  }
};

// Fetch a specific transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const transaction = await Transaction.findOne({ where: { id, userId: userId } });
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const createObj = { ...req.body, userId: req.user.id };
    const newTransaction = await Transaction.create(createObj);
    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
};

// Update a transaction by ID
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updated = await Transaction.update(req.body, {
      where: { id, userId: userId },
    });

    if (updated) {
      res.status(200).json({ id });
    } else {
      res.status(404).send();
    }
  } catch (error) {
    next(error);
  }
};

// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = await Transaction.destroy({ where: { id, userId: userId } });

    res.status(deleted ? 200 : 404).json({ id: deleted.id, deleted: Boolean(deleted) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
