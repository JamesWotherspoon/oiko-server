const User = require('../models/User');
const authUtils = require('../utils/authUtils');
const sanitize = require('../utils/sanitize');

async function createUser(req, res) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = sanitize.normalizeText(email);

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
      // If a user with the same email exists, return an error response
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await authUtils.hashPassword(password);

    // Create user
    const user = await User.create({ email: normalizedEmail, passwordHash });

    // Create user token and attach to res
    authUtils.setAuthToken(res, user.id, user.email);

    res.status(201).json({ id: user.id });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

const getUserById = async (req, res) => { };

const updateUserById = async (req, res) => { };

const deleteUserById = async (req, res) => { };

module.exports = {
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
};
