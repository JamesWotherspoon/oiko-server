const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authSecretKey = process.env.AUTH_SECRET_KEY;
// const domain = process.env.DOMAIN;
const tokensExpiry = '7d';

// Auth Token for client to sever authentication
exports.setAuthToken = (res, userId, email) => {
  try {
    const authToken = jwt.sign({ id: userId, email }, authSecretKey, {
      expiresIn: tokensExpiry,
    });

    res.cookie('authToken', authToken, {
      httpOnly: true,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
      path: '/',
      // domain: domain,
    });
  } catch (error) {
    console.error('Error setting auth cookie:', error);
  }
};

exports.comparePasswords = async (password, passwordHash) => {
  return await bcrypt.compare(password, passwordHash);
};

exports.hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
