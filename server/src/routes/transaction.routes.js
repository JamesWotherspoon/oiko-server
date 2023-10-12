const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transaction.controller');

// Get all transactions
router.get('/transactions', getTransactions);

// Get transaction by ID
router.get('/transactions/:id', getTransactionById);

// Set transaction
router.post('/transactions', createTransaction);

// Update transaction
router.put('/transactions/:id', updateTransaction);

// Delete transaction
router.delete('/transactions/:id', deleteTransaction);

module.exports = router;
