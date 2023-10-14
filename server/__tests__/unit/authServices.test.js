const authUtils = require('../../src/utils/authUtils');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Authentication Utils Unit Test', () => {
  describe('comparePasswords', () => {
    test('should return true if passwords match', async () => {
      const passwordHash = await authUtils.hashPassword('password123');

      const result = await authUtils.comparePasswords('password123', passwordHash);
      expect(result).toBe(true);
    });

    test('should return false if passwords do not match', async () => {
      const incorrectPasswordHash = await authUtils.hashPassword('incorrectPassword123');

      const result = await authUtils.comparePasswords('password123', incorrectPasswordHash);
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    test('should return hashed password', async () => {
      const password = 'password123';
      const passwordHash = await authUtils.hashPassword(password);
      expect(passwordHash).not.toEqual(password);
    });
  });

  describe('setAuthToken', () => {
    test('should set auth token on response object', () => {
      const mockToken = 'sample_token';
      const res = {
        cookie: jest.fn(),
      };

      jwt.sign.mockReturnValueOnce(mockToken);

      authUtils.setAuthToken(res, 1, 'test@example.com');

      expect(res.cookie).toHaveBeenCalledWith(
        'authToken',
        mockToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'Lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
          path: '/',
        }),
      );
    });
  });
});
