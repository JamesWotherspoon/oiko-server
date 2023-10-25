const jwt = require('jsonwebtoken');
const authSecretKey = process.env.AUTH_SECRET_KEY;

const authenticateUser = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, authSecretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


module.exports = { authenticateUser };
