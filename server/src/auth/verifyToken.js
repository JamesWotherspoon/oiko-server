const jwt = require('jsonwebtoken');
const {cookieName} = require('./authToken.config');

const secretKey = process.env.TOKEN_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.cookies[cookieName];

  if (!token) return res.status(401).json({message: 'Access denied'});

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({message: 'Invalid token'});
    req.user = user;
    console.log('cookie verified');
    next();
  });
};


module.exports = verifyToken;
