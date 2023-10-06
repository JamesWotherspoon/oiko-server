/* eslint-disable no-undef */
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

describe('Middleware Tests', () => {
  test('should set the correct CORS headers', async () => {
    // Get response
    const response = await setOriginHeader(api.get('/api'));
    // Assert the response headers
    expect(response.headers['access-control-allow-origin']).toBe(allowedClientOrigin);
    expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE');
    expect(response.headers['access-control-allow-headers']).toBe('Content-Type');
  });

  // Test Content-Security-Policy
  test('Content-Security-Policy Middleware', async () => {
    // Send a request and check the response headers
    const response = await setOriginHeader(api.get('/api'));
    expect(response.headers['content-security-policy']).toBe(
        'default-src \'self\'; script-src \'self\'',
    );
  });

  // Test rate limiter
  test('Rate Limiter Middleware', async () => {
    const requests = [];
    const maxRequests = 100;

    // Send 100 requests to the same endpoint within a minute
    for (let i = 0; i < maxRequests; i++) {
      requests.push(setOriginHeader(api.get('/api')));
    }
    // Await request responses
    const responses = await Promise.all(requests);

    // Expect atleast the first 80 to be OK responses
    // API requests will be made in previous tests
    // Therefore 100 OK responses are not expected
    for (let i = 0; i < maxRequests - 20; i++) {
      expect(responses[i].status).toBe(200);
    }

    // Send an additional request - maxRequests + 1
    const response = await setOriginHeader(api.get('/api'));

    // Expect response to be a rate limit error
    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      error: 'Too many requests, please try again later.',
    });
  });
});
