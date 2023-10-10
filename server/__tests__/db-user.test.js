// user.test.js (Your Jest Test Script)
const User = require('../src/models/User'); // Import your Sequelize model

describe('User Model Tests', () => {
  // Test Create (INSERT) and Read (SELECT) operations
  describe('Database Operations', () => {
    // Create variables to hold references to created users
    let createdUser;

    // Before each test case, create test data
    beforeEach(async () => {
      createdUser = await User.create({
        email: 'testuser@example.com',
        passwordHash: 'hashed_password', // Replace with an actual password hash
      });
    });

    // After each test case, clean up the test data
    afterEach(async () => {
      // Clean up the created users
      if (createdUser) {
        await createdUser.destroy();
      }
    });

    // Test user creation (INSERT) and retrieval (SELECT)
    it('should create a new user and retrieve it from the database', async () => {
      const retrievedUser = await User.findOne({where: {email: 'testuser@example.com'}});

      expect(retrievedUser).toBeDefined();
      expect(retrievedUser.email).toBe('testuser@example.com');
      // Add more assertions as needed
    });

    // Test user update (UPDATE) operation
    it('should update an existing user in the database', async () => {
      // Update the user's email
      await createdUser.update({email: 'updateduser@example.com'});

      const updatedUser = await User.findByPk(createdUser.id);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.email).toBe('updateduser@example.com');
      // Add more assertions as needed
    });

    // Test user deletion (DELETE) operation
    it('should delete an existing user from the database', async () => {
      // Delete the user
      await createdUser.destroy();

      const deletedUser = await User.findByPk(createdUser.id);

      expect(deletedUser).toBeNull(); // User should not exist in the database
    });
  });
});
