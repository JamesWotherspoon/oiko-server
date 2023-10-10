const jwt = require('jsonwebtoken');

const secretKey = process.env.TOKEN_SECRET_KEY;
const domain = process.env.DOMAIN;

// eslint-disable-next-line require-jsdoc
function generateAuthToken(user) {
  try {
  // Generate a token (you should implement this function)
    const payload = {
      id: user.id, // User ID or other relevant user information
      email: user.email, // User's email address or other relevant user data
    };
    // Generate the token with a specific expiration time (adjust as needed)

    const token = jwt.sign({payload: payload}, secretKey, {
      expiresIn: '7d', // Token expires in 7 days
    });
    return token;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}

const cookieName = 'authTokenCookie';

const cookieConfig = {
  httpOnly: true,
  sameSite: 'Lax', // Change to Lax or None as needed
  maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration (7 days)
  path: '/', // Cookie path
  domain: domain, // Set the domain to localhost:3000
};

module.exports = {generateAuthToken, cookieConfig, cookieName};
