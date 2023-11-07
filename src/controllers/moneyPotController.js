const moneyPotService = require('../services/moneyPotService');

const getMoneyPots = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const moneyPots = await moneyPotService.retrieve(userId);

    res.status(200).json(moneyPots);
  } catch (error) {
    next(error);
  }
};

// Fetch a specific money pot by ID
const getMoneyPotById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const moneyPot = await moneyPotService.retrieveById(userId, id);

    res.status(200).json(moneyPot);
  } catch (error) {
    next(error);
  }
};

const createMoneyPot = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const moneyPotData = req.body;

    const moneyPot = await moneyPotService.create(userId, moneyPotData);

    res.status(201).json(moneyPot);
  } catch (error) {
    next(error);
  }
};

// Update a money pot by ID
const updateMoneyPotById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const moneyPotData = req.body;

    const updatedItem = await moneyPotService.updateById(userId, id, moneyPotData);

    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

// Delete a money pot by ID
const deleteMoneyPotById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await moneyPotService.deleteById(userId, id);

    res.status(200).json(id);
  } catch (error) {
    next(error);
  }
};

const transferMoneyPots = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transferData = req.body;

    const transfer = await moneyPotService.transfer(userId, transferData);

    res.status(200).json(transfer);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMoneyPots,
  getMoneyPotById,
  createMoneyPot,
  updateMoneyPotById,
  deleteMoneyPotById,
  transferMoneyPots,
};
