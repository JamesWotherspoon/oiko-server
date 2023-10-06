const User = require('../models/User');

/**
 * Creates a new user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @return {Promise<void>} A promise that resolves when the user is created.
 */
async function createUser(req, res) {
  try {
    const {username, email, password} = req.body;
    // Create user
    const newUser = await User.create({username, email, password});
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({error: 'Failed to create user'});
  }
}

/**
 * Gets a user by their ID.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @return {Promise<void>} A promise that resolves with the user data or an error.
 **/
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({error: 'Failed to fetch user'});
  }
}

module.exports = {
  createUser,
  getUserById,
};
