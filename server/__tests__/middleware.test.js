const request = require("supertest");
const app = require("../src/app");

// Create an instance of the Express application
// Passing app bypasses starting the server in server.js
// Note: The server needs to be running before executing the test
const api = request(app);

describe("Middleware Tests", () => {

  // Test Content-Security-Policy
  test("Content-Security-Policy Middleware", async () => {
    // Send a request and check the response headers
    const response = await api.get("/api");
    expect(response.headers["content-security-policy"]).toBe(
      "default-src 'self'; script-src 'self'"
    );
  });

  // Test rate limiter
  test("Rate Limiter Middleware", async () => {
    const requests = [];
    const maxRequests = 100;

    // Send 100 requests to the same endpoint within a minute
    for (let i = 0; i < maxRequests; i++) {
      requests.push(api.get("/api"));
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
    const response = await api.get("/api");

    // Expect response to be a rate limit error
    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      error: "Too many requests, please try again later.",
    });
  });
});
