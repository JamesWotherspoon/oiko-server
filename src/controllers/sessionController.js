const sessionService = require('../services/sessionService');
const { authCookieOptions } = require('../utils/authUtils');

const getSession = (req, res) => {
  res.status(200).json({ message: 'Session found', isAuthenticated: true });
};

const createSession = async (req, res, next) => {
  try {
    const credentials = req.body;

    const authToken = await sessionService.initiateSession(credentials);

    // Attach the authToken to the response as a cookie
    res.cookie('authToken', authToken, authCookieOptions);

    res.status(200).json({ message: 'Login successful', isAuthenticated: true });
  } catch (error) {
    next(error);
  }
};

const deleteSession = (req, res) => {
  res.clearCookie('authToken', { domain: process.env.DOMAIN, path: '/', httpOnly: true });
  res.status(200).json({ message: 'Logout successful', isAuthenticated: false });
};

module.exports = {
  createSession,
  deleteSession,
  getSession,
};
