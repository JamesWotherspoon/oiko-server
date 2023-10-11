const User = require('../../models/User');
const authServices = require('../../services/authServices');

async function registerUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      // If a user with the same email exists, return an error response
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // Hash password
    const passwordHash = await authServices.hashPassword(password);

    // Create user
    const user = await User.create({ email, passwordHash });

    // Create user token and attach to res
    authServices.setAuthToken(res, user.id, user.email);

    res.status(201).json({ userId: user.id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

module.exports = {
  registerUser,
};
