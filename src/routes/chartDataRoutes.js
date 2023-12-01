const express = require('express');
const router = express.Router();
const {
  getChartData,
  getDataPastThirtyDays,
} = require('../controllers/chartDataController');
const { sanitizeAndValidate } = require('../middleware/sanitizeAndValidateMiddleware');

// Get chart by query params
router.get('/', getChartData);

router.get('/past-thirty-days', getDataPastThirtyDays);

module.exports = router;
