const request = require('supertest');
const User = require('../../src/models/User');
const app = require('../../src/app');
const authServices = require('../../src/services/authServices');

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

  test('should register a new user', async () => {
    // Make a POST request to register a user
    const response = await api
        .post('/api/auth/register')
        .send(JSON.stringify(testUser))
        .set('Content-Type', 'application/json');

    testUser.id = response.body.userId;
    // Query the database to check if the user exists
    const registeredUser = await User.findOne({
      where: { id: testUser.id },
    });

    expect(response.status).toBe(201);
    expect(registeredUser.email).toBe(testUser.email);
  });


  test('should create and login user', async () => {
    // Hash Password
    const passwordHash = await authServices.hashPassword(testUser.password);
    // Create User
    await User.create({ email: testUser.email, passwordHash: passwordHash });

    // Make a POST request to login user
    const response = await api
        .post('/api/auth/login')
        .send(JSON.stringify({ email: testUser.email, password: testUser.password }))
        .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });
});
