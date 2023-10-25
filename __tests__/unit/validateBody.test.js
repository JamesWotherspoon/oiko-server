const { sanitizeAndValidate } = require('../../src/middleware/sanitizeAndValidateMiddleware');

describe('sanitizeAndValidate middleware', () => {
  it('should return a middleware function', () => {
    const middleware = sanitizeAndValidate('body', {});
    expect(typeof middleware).toBe('function');
  });

  it('should call next if the request body is valid', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age'],
    };
    const middleware = sanitizeAndValidate('body', schema);
    const req = { body: { name: 'John', age: 30 } };
    const res = {};
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return a 400 error if the request body is invalid', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age'],
    };
    const middleware = sanitizeAndValidate('body', schema);
    const req = { body: { name: 'John' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a 400 error if the request body contains a <script> tag', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
      },
      required: ['name', 'age'],
    };
    const middleware = sanitizeAndValidate('body', schema);
    const req = { body: { name: '<script>alert("hello world")</script>', age: 30 } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
