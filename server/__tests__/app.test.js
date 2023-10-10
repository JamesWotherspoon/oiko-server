const request = require('supertest');
const app = require('../src/app');
require('dotenv').config();

// Enviormental variable for client origin
const allowedClientOrigin = process.env.CLIENT_ORIGIN;

// Set the origin header to .env variable
const setOriginHeader = (agent) => {
  return agent.set('Origin', allowedClientOrigin);
};

// Create an instance of the Express application
// Passing app bypasses starting the server in server.js
// Note: The server needs to be running before executing the test
const api = request(app);

// Test the API root path "/api"
describe('Test API routes', () => {
  // Test route that does not exist is handled
  test('Not found API route - should respond with a 404 status code', async () => {
    const response = await setOriginHeader(api.get('/thispathdoesnotexist'));
    expect(response.statusCode).toBe(404);
  });
  // Test base API route '/api'
  test('Base API route \'/api\' - should respond with a 200 status code', async () => {
    const response = await setOriginHeader(api.get('/api'));
    expect(response.statusCode).toBe(200);
  });
});
