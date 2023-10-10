const User = require('../../models/User');
const {generateAuthToken, cookieConfig, cookieName} = require('../../auth/authToken.config');
const bcrypt = require('bcrypt');

/**
 * Login a user.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @return {Promise<void>} A promise that resolves when the user is logged in.
 */
async function loginUser(req, res) {
  try {
    const {email, password} = req.body;

    // Find the user by email
    const user = await User.findOne({where: {email}});

    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({error: 'Invalid password'});
      return;
    }
    // If the password is valid, set the authentication token cookie

    const token = generateAuthToken(user);
    res.cookie(cookieName, token, cookieConfig);
    res.status(200).json({message: 'Login successful'});
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({error: 'Failed to log in user'});
  }
}

module.exports = {
  loginUser,
};
