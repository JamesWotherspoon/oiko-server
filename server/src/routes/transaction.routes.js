const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transaction.controller');
const { validateBody } = require('../middleware/validation.middleware');

// Get all transactions
router.get('/', getTransactions);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Set transaction
router.post(
    '/',
    validateBody({
      userId: ['required', 'integer'],
      categoryId: ['optional', 'integer'],
      transactionType: ['required', 'string', ['income', 'expense']],
      name: ['required', 'string'],
      amount: ['required', 'number'],
      transactionDate: ['required', 'date'],
      description: ['optional', 'string'],
    }),
    createTransaction,
);

// Update transaction
router.put('/:id', updateTransaction);

// Delete transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
