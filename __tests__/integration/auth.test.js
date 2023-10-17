const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const authUtils = require('../../src/utils/authUtils');

const api = request(app);

describe('User Authentication Tests', () => {
  // Create a test user to use in your tests
  const testUser = {
    email: 'testuser@example.com',
    password: 'password123',
    id: undefined,
  };

  // Clean up after all tests
  afterEach(async () => {
    if (true) {
      // Delete the user from the database
      await User.destroy({
        where: { email: testUser.email },
      });
    }
  });

  test('should create a new user', async () => {
    // Make a POST request to register a user
    const response = await api
      .post('/api/users')
      .send(JSON.stringify(testUser))
      .set('Content-Type', 'application/json');

    testUser.id = response.body.id;
    // Query the database to check if the user exists
    const registeredUser = await User.findOne({
      where: { id: testUser.id },
    });

    expect(response.status).toBe(201);
    expect(registeredUser.email).toBe(testUser.email);
  });


  test('should create and login user', async () => {
    // Hash Password
    const passwordHash = await authUtils.hashPassword(testUser.password);
    // Create User
    await User.create({ email: testUser.email, passwordHash: passwordHash });

    // Make a POST request to login user
    const response = await api
      .post('/api/sessions')
      .send(JSON.stringify({ email: testUser.email, password: testUser.password }))
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });
});
