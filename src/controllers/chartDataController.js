const chartDataService = require('../services/chartDataService');

const getChartData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { moneyPotId, month, year } = req.query;
    let chartName;

    const chartData = await chartDataService.calculateChartData(userId, moneyPotId, month, year);

    if (moneyPotId) {
      chartName = `moneyPot-${moneyPotId}`;
    } else {
      chartName = 'allMoneyPots';
    }

    res.status(200).json({ chartName: chartName, data: chartData, message: 'Successfully fetched chart data' });
  } catch (error) {
    next(error);
  }
};

const getDataPastThirtyDays = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await chartDataService.calculatePastThirtyDays(userId);

    res.status(200).json({ chartName: 'pastThirtyDays', data, message: 'Successfully fetched past thirty days' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChartData,
  getDataPastThirtyDays,
};
