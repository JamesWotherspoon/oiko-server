const User = require('../models/UserModel');
const { generateAuthToken, verifyPassword } = require('../utils/authUtils');
const { normalizeText } = require('../utils/sanitizeUtils');
const { NotFoundError, AuthenticationError } = require('../utils/customErrorUtils');

const initiateSession = async ({ email, password }) => {
  try {
    const normalizedEmail = normalizeText(email);
    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid password', 'INVALID_PASSWORD');
    }

    const authToken = generateAuthToken(user.id, user.email);
    return authToken;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiateSession,
};
