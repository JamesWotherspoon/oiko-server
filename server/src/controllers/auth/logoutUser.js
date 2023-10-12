const logoutUser = (req, res) => {
  res.clearCookie('authToken', { domain: process.env.DOMAIN, path: '/' });

  // Send response
  return res.status(200).json({ message: 'User logged out successfully' });
};

module.exports = {
  logoutUser,
};
