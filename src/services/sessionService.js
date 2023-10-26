const User = require('../models/UserModel');
const { generateAuthToken, verifyPassword } = require('../utils/authUtils');
const { normalizeText } = require('../utils/sanitizeUtils');

const initiateSession = async ({ email, password }) => {
  const normalizedEmail = normalizeText(email);
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) throw new Error('User not found');

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) throw new Error('Invalid password');

  const authToken = generateAuthToken(user.id, user.email);

  return authToken;
};

module.exports = {
  initiateSession,
};
