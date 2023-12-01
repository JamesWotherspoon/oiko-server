const Category = require('../models/CategoryModel');
const Transaction = require('../models/TransactionModel');
const { Op } = require('sequelize');
const { lastDayOfMonth } = require('date-fns');

const createDatasetTemplateForCategories = (categories, daysInMonth) => {
  const emptyDataPoints = Array.from({ length: daysInMonth }, () => 0);
  const datasetTemplate = {};

  categories.forEach((category) => {
    datasetTemplate[category.id] = {
      label: category.name,
      id: category.id,
      data: [...emptyDataPoints],
      backgroundColor: category.color,
      borderSkipped: false,
    };
  });

  datasetTemplate['0'] = {
    label: 'Not in Category',
    id: 0,
    data: [...emptyDataPoints],
    backgroundColor: 'grey',
  };

  return datasetTemplate;
};

const populateDatasets = (transactions, datasetTemplate, daysInMonth) => {
  transactions.forEach((transaction) => {
    const dayOfMonth = new Date(transaction.transactionDate).getDate();
    const categoryId = transaction.categoryId || 0;
    datasetTemplate[categoryId].data[dayOfMonth - 1] += parseFloat(transaction.amount);
  });

  return Object.values(datasetTemplate);
};

const calculateChartData = async (userId, moneyPotId, month, year) => {
  // Validate month parameter
  if (month < 0 || month > 11) {
    throw new Error('Invalid month. Must be between 0 and 11.');
  }

  const firstDateOfMonth = new Date(year, month, 1);
  const lastDateOfMonth = lastDayOfMonth(firstDateOfMonth);
  const daysInMonth = lastDateOfMonth.getDate();

  // Error handling for database queries
  try {
    const transactions = await Transaction.findAll({
      where: {
        userId: userId,
        transactionDate: {
          [Op.between]: [firstDateOfMonth, lastDateOfMonth],
        },
        ...(moneyPotId && { moneyPotId: moneyPotId }),
      },
    });

    const categories = await Category.findAll({
      where: {
        userId: userId,
      },
    });

    const datasetTemplate = createDatasetTemplateForCategories(categories, daysInMonth);
    const datasets = populateDatasets(transactions, datasetTemplate, daysInMonth);

    const labels = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const data = {
      labels: labels,
      datasets: datasets,
    };

    return data;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw new Error('Failed to retrieve data. Please try again.');
  }
};

const calculatePastThirtyDays = async (userId) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 29);

  try {
    const transactions = await Transaction.findAll({
      where: {
        userId: userId,
        transactionDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    let total = 0;

    transactions.forEach((transaction) => {
      const isExpense = transaction.transactionType === 'negative';
      const parsedAmount = parseFloat(transaction.amount);
      if (isExpense) {
        total -= parsedAmount;
      } else {
        total = total + parsedAmount;
      }
    });
    let isNegative = false;
    if (total < 0) {
      isNegative = true;
    }
    total = Math.abs(total);
    return { isNegative, total };
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw new Error('Failed to retrieve data. Please try again.');
  }
};

module.exports = {
  calculateChartData,
  calculatePastThirtyDays,
};
