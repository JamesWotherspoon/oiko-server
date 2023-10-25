const moneyPotServices = require('../services/moneyPotServices');

const getMoneyPots = async (req, res, next) => {
  try {
    const moneyPots = await moneyPotServices.retrieve(req.user.id);

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
    const moneyPot = await moneyPotServices.retrieveById(req.user.id, req.params.id);
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
    const moneyPot = await moneyPotServices.create(req.user.id, req.body);
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
    const moneyPot = await moneyPotServices.update(req.user.id, req.params.id, req.body);

    if (moneyPot.length) {
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
    const deleted = await moneyPotServices.destroy(req.user.id, req.params.id);

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

const transferMoneyPots = async (req, res, next) => {
  try {
    const transfer = await moneyPotServices.transfer(req.user.id, req.body);

    if (transfer) {
      res.status(200).json(transfer);
    } else {
      res.status(500).send();
    }
  } catch (error) {
    const enhancedError = new Error(
      `Failed money pot transfer with user ID ${req.user.id} from pot ${req.body.fromPotId} to  pot ${req.body.toPotId}.` +
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
