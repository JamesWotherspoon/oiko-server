const User = require('../../models/User');
const authUtils = require('../../utils/authUtils');
const sanitize = require('../../utils/sanitize');

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = sanitize.normalizeText(email);

    // Find the user by email
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = authUtils.comparePasswords(
        password,
        user.passwordHash,
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    // If the password is valid, set the authentication token cookie
    authUtils.setAuthToken(res, user.id, user.email);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
}

module.exports = {
  loginUser,
};
