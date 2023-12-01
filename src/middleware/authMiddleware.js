const jwt = require('jsonwebtoken');
const authSecretKey = process.env.AUTH_SECRET_KEY;
const User = require('../models/UserModel');

const verifyUserExists = async (userId) => {
  const userData = await User.findByPk(userId);
  return userData !== null;
};

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    jwt.verify(token, authSecretKey, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      const userExists = verifyUserExists(decodedUser.Id);

      if (!userExists) {
        res.clearCookie('authToken', { domain: process.env.DOMAIN, path: '/', httpOnly: true });
        return res.status(403).json({ message: 'User does not exist' });
      }
      return req.user = decodedUser;
    });

    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
