const bcrypt = require('bcrypt');

// eslint-disable-next-line require-jsdoc
async function hashPassword(password) {
  const saltRounds = 10; // You can adjust the number of salt rounds for security.
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

module.exports = {
  hashPassword,
};
