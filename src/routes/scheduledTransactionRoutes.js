const express = require('express');
const router = express.Router();
const {
  getScheduledTransactions,
  getScheduledTransactionById,
  handleCreateScheduledTransaction,
  updateScheduledTransactionById,
  deleteScheduledTransactionById,
} = require('../controllers/scheduledTransactionController');
const validate = require('../middleware/validateMiddleware');
const { querySchema, bodySchema } = require('../api-schemas/scheduledTransactionApiSchema');

// Get all scheduled transactions
router.get('/', validate('query', querySchema), getScheduledTransactions);

// Get scheduled transaction by ID
router.get('/:id', getScheduledTransactionById);

// Set scheduled transaction
router.post('/', validate('body', bodySchema), handleCreateScheduledTransaction);

// Update scheduled transaction
router.put('/:id', validate('body', bodySchema), updateScheduledTransactionById);

// Delete scheduled transaction
router.delete('/:id', deleteScheduledTransactionById);

module.exports = router;
