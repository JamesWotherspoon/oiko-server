const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/UserModel');
const Category = require('../src/models/CategoryModel');
const MoneyPot = require('../src/models/MoneyPotModel');
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

const createUserCategory = async (userId) => {
  return await Category.create({ userId: userId, type: 'income', name: 'Salary' });
};

const createMoneyPot = async (userId) => {
  return await MoneyPot.create({ userId: userId, name: 'My MoneyPot', balance: 1000 });
};

module.exports = {
  createUserAndLogin,
  deleteUser,
  createUserCategory,
  createMoneyPot,
};
