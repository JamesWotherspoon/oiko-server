const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
} = require('../controllers/transactionController');
const validate = require('../middleware/validateMiddleware');
const { querySchema, bodySchema } = require('../api-schemas/transactionApiSchema');

// Get all transactions
router.get('/', validate('query', querySchema), getTransactions);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Set transaction
router.post('/', validate('body', bodySchema.post), createTransaction);

// Update transaction
router.put('/:id', updateTransactionById);

// Delete transaction
router.delete('/:id', deleteTransactionById);

module.exports = router;
