const { authCookieOptions } = require('../utils/authUtils');
const sessionService = require('../services/sessionService');
const userService = require('../services/userService');

async function createUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userService.create({ email, password });

    // Create user token and attach to res
    const authToken = await sessionService.initiateSession({ email, password });

    // Attach the authToken to the response as a cookie
    res.cookie('authToken', authToken, authCookieOptions);

    res.status(201).json({ id: user.id });
  } catch (error) {
    // res.status(500).json({ message: error.message ? error.message : 'Failed to create user' });
    next(error);
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.retrieveById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message ? error.message : 'Failed to retrieve user' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    const user = await userService.updateById(id, userData);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await userService.deleteById(id);

    res.status(200).json(deleted);
  } catch (error) {
    res.status(404).json({ message: error.message ? error.message : 'Failed to delete user' });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
