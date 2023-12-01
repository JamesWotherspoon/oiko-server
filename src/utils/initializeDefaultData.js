async function initializeCategories(userId) {
  const Category = require('../models/CategoryModel');
  try {
    const existingCategories = await Category.findAll({ where: { userId } });

    if (existingCategories.length === 0) {
      await Category.bulkCreate([
        { userId, type: 'negative', name: 'Commute', iconIdentifier: 'commute', color: '#4caf50', description: '' },
        { userId, type: 'negative', name: 'Holidays', iconIdentifier: 'holidays', color: '#ff9800', description: '' },
        { userId, type: 'negative', name: 'Drinks', iconIdentifier: 'drinks', color: '#e91e63', description: '' },
        { userId, type: 'negative', name: 'Meals Out', iconIdentifier: 'dining', color: '#673ab7', description: '' },
        { userId, type: 'negative', name: 'Groceries', iconIdentifier: 'groceries', color: '#009688', description: '' },
        { userId, type: 'negative', name: 'Pets', iconIdentifier: 'pets', color: '#795548', description: '' },
        { userId, type: 'negative', name: 'Clothes', iconIdentifier: 'clothes', color: '#607d8b', description: '' },
        { userId, type: 'negative', name: 'Rent', iconIdentifier: 'rent', color: '#af2424', description: '' },
        { userId, type: 'negative', name: 'Bills', iconIdentifier: 'bills', color: '#68e4de', description: '' },
        { userId, type: 'negative', name: 'Entertainment', iconIdentifier: 'entertainment', color: '#9c27b0', description: '' },
        { userId, type: 'negative', name: 'Health', iconIdentifier: 'health', color: '#3f51b5', description: '' },
        { userId, type: 'negative', name: 'Gifts', iconIdentifier: 'gifts', color: '#009688', description: '' },
        { userId, type: 'negative', name: 'Miscellaneous', iconIdentifier: 'miscellaneous', color: '#ff5722', description: '' },
      ]);

      console.log('Default categories initialized for user with ID:', userId);
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
}
async function initializeMoneyPots(userId) {
  const MoneyPot = require('../models/MoneyPotModel');
  try {
    const existingMoneyPots = await MoneyPot.findAll({ where: { userId } });

    if (existingMoneyPots.length === 0) {
      await MoneyPot.bulkCreate([
        { userId, name: 'Debit', balance: 0, description: '' },
        { userId, name: 'Credit', balance: 0, description: '' },
        { userId, name: 'Savings', balance: 0, description: '' },
      ]);

      console.log('Default money pots initialized for user with ID:', userId);
    }
  } catch (error) {
    console.error('Error initializing money pots:', error);
  }
}

module.exports = { initializeCategories, initializeMoneyPots };
