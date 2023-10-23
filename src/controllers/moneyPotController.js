const MoneyPot = require('../models/MoneyPotModel');
const { retrieveMoneyPots, executeTransferMoneyPots } = require('../services/moneyPotService');

const getMoneyPots = async (req, res, next) => {
  try {
    const moneyPots = await retrieveMoneyPots(req.user.id);

    if (moneyPots.length !== 0) {
      res.status(200).json(moneyPots);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed fetching money pots. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Fetch a specific money pot by ID
const getMoneyPotById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const moneyPot = await MoneyPot.findOne({ where: whereClause });
    if (moneyPot) {
      res.status(200).json(moneyPot);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed fetching money pot with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack;
    next(enhancedError);
  }
};

const createMoneyPot = async (req, res, next) => {
  try {
    const createObj = { ...req.body, userId: req.user.id };
    const moneyPot = await MoneyPot.create(createObj);
    res.status(201).json(moneyPot);
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(`Failed creating money pot. Original error: ${error.message}`);
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Update a money pot by ID
const updateMoneyPotById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };

    const updated = await MoneyPot.update(req.body, {
      where: whereClause,
    });

    if (updated.length) {
      res.status(200).json({ updated: true });
    } else {
      res.status(404).json({ updated: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed updating money pot with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

// Delete a money pot by ID
const deleteMoneyPotById = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id, userId: req.user.id };
    const deleted = await MoneyPot.destroy({ where: whereClause });

    if (deleted) {
      res.status(200).json({ deleted: true });
    } else {
      res.status(404).json({ deleted: false });
    }
  } catch (error) {
    // Adding a custom error message for internal logging
    const enhancedError = new Error(
      `Failed deleting money pot with ID: ${req.params.id}. Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
  }
};

const transferMoneyPots = async (res, req, next) => {
  try {
    const { amount, fromPotId, toPotId } = req.body;
    const userId = req.user.id;

    const transfer = await executeTransferMoneyPots(userId, { amount, fromPotId, toPotId });

    if (transfer.success) {
      res.status(200).json(transfer);
    } else {
      res.status(500).send();
    }
  } catch (error) {
    const enhancedError = new Error(
      `Failed money pot transfer with user ID ${userId} from pot ${fromPotId} to  pot ${toPotId}.` +
        `Original error: ${error.message}`,
    );
    enhancedError.stack = error.stack; // Preserving the original stack trace
    next(enhancedError);
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
