const User = require('../../models/User');
const {hashPassword} = require('../../utils/hashPassword');
const {setAuthTokenCookie} = require('../../auth/authToken.config');

/**
 * Creates a new user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @return {Promise<void>} A promise that resolves when the user is created.
 */
async function createUser(req, res) {
  try {
    const {email, password} = req.body;
    // Hash password
    const passwordHash = await hashPassword(password);
    // Create user
    const newUser = await User.create({email, passwordHash});

    setAuthTokenCookie(res, newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({error: 'Failed to create user'});
  }
}

module.exports = {
  createUser,
};
