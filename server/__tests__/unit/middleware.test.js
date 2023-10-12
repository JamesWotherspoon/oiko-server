const request = require('supertest');
const app = require('../../src/app');
require('dotenv').config();

// Enviormental variable for client origin
const allowedClientOrigin = process.env.CLIENT_ORIGIN;

const api = request(app);

describe('Middleware Tests', () => {
  test('should process JSON data correctly', async () => {
    const data = { key: 'testValue' };
    const response = await request(app)
        .post('/api/test/jsonParser')
        .send(data)
        .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.text).toBe(data.key);
  });

  test('should set cookie and receive cookie value in response text', async () => {
    const cookieValue = 'testCookieValue';
    const response = await api
        .get('/api/test/cookieParser')
        .set('cookie', `testCookie=${cookieValue}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe(cookieValue);
  });

  test('should set the correct CORS headers', async () => {
    const response = await api.options('/api/test').send();

    // Assert the CORS headers
    expect(response.headers['access-control-allow-origin']).toBe(allowedClientOrigin);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
    expect(response.headers['access-control-allow-headers']).toBe('Content-Type');
    expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE');
  });
  test('should allow a limited number of requests within a minute', async () => {
    const ipForTestingRateLimiter = '10.10.10.10';

    // Send multiple requests with the same IP
    for (let i = 0; i < 90; i++) {
      const response = await request(app)
          .get('/api/test')
          .set('x-forwarded-for', ipForTestingRateLimiter);

      if (i < 78) {
        expect(response.status).toBe(200); // Expect a success response
      } else if (i > 80) {
        expect(response.status).toBe(429); // Expect a rate-limit exceeded response
      }
    }
  });
});
