const Transaction = require('../models/Transaction');

// Fetch all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.findAll({ where: { userId: userId } });
    if (transactions.length === 0) {
      res.status(204);
    } else {
      res.status(200).json(transactions);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Use a generic error message
  }
};

// Fetch a specific transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const transaction = await Transaction.findOne({ where: { id, userId: userId } });
    if (transaction) {
      res.status(200).json(transaction);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId, transactionType, name, amount, description } = req.body;

    const newTransaction = await Transaction.create({
      userId,
      categoryId,
      transactionType,
      name,
      amount,
      description,
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a transaction by ID
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updated = await Transaction.update(req.body, {
      where: { id, userId: userId },
    });

    if (updated) {
      res.status(200).json({ id });
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a transaction by ID
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const deleted = await Transaction.destroy({ where: { id, userId: userId } });

    res.status(deleted ? 200 : 404).json({ deleted: Boolean(deleted) });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
