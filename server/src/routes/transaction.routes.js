const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transaction.controller');
const { validateBody } = require('../middleware/validateBody');
const transactionApiSchema = require('../api_schemas/transactionSchema');

// Get all transactions
router.get('/', getTransactions);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Set transaction
router.post(
  '/',
  validateBody(transactionApiSchema.post.body),
  createTransaction,
);

// Update transaction
router.put('/:id', updateTransaction);

// Delete transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
