const request = require('supertest');
require('dotenv').config();
const express = require('express');
const middleware = require('../../src/middleware/appMiddleware');

// Enviormental variable for client origin
const allowedClientOrigin = process.env.CLIENT_ORIGIN;

describe('Middleware Unit Tests', () => {
  describe('CORS, cookie parsing and JSON parsing', () => {
    const app = express();
    app.use(middleware.corsMiddleware);
    app.use(middleware.cookieParse);
    app.use(middleware.parseJson);

    app.post('/parseJson', (req, res) => {
      res.status(200).send(req.body.key);
    });
    app.get('/cookieParser', (req, res) => {
      res.status(200).send(req.cookies.testCookie);
    });

    const server = app.listen(6000);

    test('should process CORS correctly', async () => {
      const response = await request(app).options('/cors').set('Origin', allowedClientOrigin);

      expect(response.headers['access-control-allow-origin']).toBe(allowedClientOrigin);
      expect(response.headers['access-control-allow-credentials']).toBe('true');
      expect(response.headers['access-control-allow-headers']).toBe('Content-Type');
      expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE');
    });

    test('should process JSON data correctly', async () => {
      const data = { key: 'testValue' };

      const response = await request(app).post('/parseJson').send(data).set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.text).toBe(data.key);
    });
    test('should process cookies correctly', async () => {
      const data = { key: 'testValue' };
      const response = await request(app).get('/cookieParser').set('Cookie', `testCookie=${data.key}`);
      expect(response.status).toBe(200);
      expect(response.text).toBe(data.key);
    });

    server.close();
  });

  describe('Rate limiter test', () => {
    const app = express();
    app.use(middleware.limiter);
    app.get('/limiter', (req, res) => {
      res.status(200).send('success');
    });
    const server = app.listen(8000);

    test('should limit requests', async () => {
      Array.from({ length: 80 }).forEach(async () => {
        const response = await request(app).get('/limiter');
        expect(response.status).toBe(200);
      });
      const response = await request(app).get('/limiter');
      expect(response.status).toBe(429);
    });
    server.close();
  });
});
