const sessionService = require('../services/sessionService');
const { authCookieOptions } = require('../utils/authUtils');

const getSession = (req, res) => {
  res.status(200).send('Valid Token');
};

const createSession = async (req, res) => {
  try {
    const credentials = req.body;

    const authToken = await sessionService.initiateSession(credentials);

    // Attach the authToken to the response as a cookie
    res.cookie('authToken', authToken, authCookieOptions);

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const deleteSession = (req, res) => {
  res.clearCookie('authToken', { domain: process.env.DOMAIN, path: '/' });
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  createSession,
  deleteSession,
  getSession,
};
