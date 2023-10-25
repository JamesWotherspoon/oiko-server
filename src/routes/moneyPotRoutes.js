const express = require('express');
const router = express.Router();
const {
  getMoneyPots,
  getMoneyPotById,
  createMoneyPot,
  updateMoneyPotById,
  deleteMoneyPotById,
  transferMoneyPots,
} = require('../controllers/moneyPotController');
const validate = require('../middleware/validateMiddleware');
const { bodySchema } = require('../api-schemas/moneyPotApiSchema');

// Get all money pots
router.get('/', getMoneyPots);

// Get money pot by ID
router.get('/:id', getMoneyPotById);

// Set money pot
router.post('/', validate('body', bodySchema.moneyPot), createMoneyPot);

// Update money pot
router.put('/:id', validate('body', bodySchema.moneyPot), updateMoneyPotById);

// Delete money pot
router.delete('/:id', deleteMoneyPotById);

// A RPC endpoint to transfer money between money pots
router.post(
  '/transfer',
  validate('body', bodySchema.transfer),
  transferMoneyPots,
);

module.exports = router;
