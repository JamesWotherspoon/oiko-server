const User = require('../../models/User');
const authServices = require('../../services/authServices');

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = authServices.comparePasswords(
        password,
        user.passwordHash,
    );

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }
    // If the password is valid, set the authentication token cookie
    authServices.setAuthToken(res, user.id, user.email);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to log in user' });
  }
}

module.exports = {
  loginUser,
};
