const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
} = require('../controllers/transactionController');
const { sanitizeAndValidate } = require('../middleware/sanitizeAndValidateMiddleware');
const { querySchema, bodySchema } = require('../api-schemas/transactionApiSchema');

// Get all transactions
router.get('/', sanitizeAndValidate('query', querySchema), getTransactions);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Set transaction
router.post('/', sanitizeAndValidate('body', bodySchema), createTransaction);

// Update transaction
router.put('/:id', sanitizeAndValidate('body', bodySchema), updateTransactionById);

// Delete transaction
router.delete('/:id', deleteTransactionById);

module.exports = router;
