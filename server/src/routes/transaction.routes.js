const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
} = require('../controllers/transaction.controller');
const { validateBody, validateQuery } = require('../middleware/validateRequestData');
const { querySchema, bodySchema } = require('../api_schemas/transactionSchema');

// Get all transactions
router.get('/', validateQuery(querySchema), getTransactions);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Set transaction
router.post('/', validateBody(bodySchema.post), createTransaction);

// Update transaction
router.put('/:id', updateTransactionById);

// Delete transaction
router.delete('/:id', deleteTransactionById);

module.exports = router;
