const authServices = require('../../src/services/authServices');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('authServices', () => {
  describe('comparePasswords', () => {
    test('should return true if passwords match', async () => {
      const passwordHash = await authServices.hashPassword('password123');

      const result = await authServices.comparePasswords('password123', passwordHash);
      expect(result).toBe(true);
    });

    test('should return false if passwords do not match', async () => {
      const incorrectPasswordHash = await authServices.hashPassword('incorrectPassword123');

      const result = await authServices.comparePasswords('password123', incorrectPasswordHash);
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    test('should return hashed password', async () => {
      const password = 'password123';
      const passwordHash = await authServices.hashPassword(password);
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

      authServices.setAuthToken(res, 1, 'test@example.com');
      console.log(res.cookie);
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
