const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authSecretKey = process.env.AUTH_SECRET_KEY;
// const domain = process.env.DOMAIN;
const tokensExpiry = '7d';

const authCookieOptions = {
  httpOnly: true,
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
  path: '/',
};

// Auth Token for client to sever authentication
const generateAuthToken = (userId, email) => {
  try {
    const authToken = jwt.sign({ id: userId, email }, authSecretKey, {
      expiresIn: tokensExpiry,
    });

    return authToken;
  } catch (error) {
    throw new Error('Failed to generate auth token');
  }
};

const verifyPassword = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

module.exports = {
  generateAuthToken,
  verifyPassword,
  hashPassword,
  authCookieOptions,
};
