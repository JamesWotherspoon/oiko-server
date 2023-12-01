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

    res.status(201).json({ id: user.id, message: 'User successfully created' });
  } catch (error) {
    next(error);
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.retrieveById(id);

    res.status(200).json({ data: user, message: 'Successfully fetched user' });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    await userService.updateById(id, userData);

    res.status(200).json({ updated: true, message: 'User successfully updated' });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    await userService.deleteById(id);

    res.status(200).json({ deleted: true, message: 'User successfully deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
