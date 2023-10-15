const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const authUtils = require('../src/utils/authUtils');

const createUserAndLogin = async () => {
  const agent = request.agent(app);
  const userCredentials = {
    email: `user${Math.random()}@example.com`,
    password: 'password123',
  };

  // Hash Password
  const passwordHash = await authUtils.hashPassword(userCredentials.password);
  // Create User
  const user = await User.create({ email: userCredentials.email, passwordHash: passwordHash });

  // Login
  await agent
    .post('/api/sessions')
    .send(JSON.stringify({ email: userCredentials.email, password: userCredentials.password }))
    .set('Content-Type', 'application/json');

  return { agent, user };
};

const deleteUser = async (userId) => {
  await User.destroy({
    where: { id: userId },
  });
};

module.exports = {
  createUserAndLogin,
  deleteUser,
};
