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
});
