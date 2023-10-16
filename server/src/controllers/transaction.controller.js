const Transaction = require('../models/Transaction');
const transactionService = require('../services/transaction.service');

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionService.retrieveTransactions(req.user.id, req.query);

    if (transactions.length !== 0) {
      res.status(200).json(transactions);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
};

// Fetch a specific transaction by ID
const getTransactionById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const transaction = await Transaction.findOne({ where: whereClause });
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
    const transaction = await Transaction.create(createObj);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Update a transaction by ID
const updateTransactionById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };

    const updated = await Transaction.update(req.body, {
      where: whereClause,
    });

    if (updated.length) {
      res.status(200).json({ updated: true });
    } else {
      res.status(404).json({ updated: false });
    }
  } catch (error) {
    next(error);
  }
};

// Delete a transaction by ID
const deleteTransactionById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const deleted = await Transaction.destroy({ where: whereClause });

    if (deleted) {
      res.status(200).json({ deleted: true });
    } else {
      res.status(404).json({ deleted: false });
    }
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
