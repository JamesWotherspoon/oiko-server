const express = require('express');
const router = express.Router();
const protectedRouter = express.Router();
const UserController = require('../controllers/userController');
const sanitizeAndValidate = require('../middleware/sanitizeAndValidateMiddleware');
const { bodySchema } = require('../api-schemas/userApiSchema');

// GET a single user by ID
protectedRouter.get('/:id', UserController.getUserById);

// CREATE a new user
router.post('/', sanitizeAndValidate('body', bodySchema), UserController.createUser);

// UPDATE a user by ID
protectedRouter.put('/:id', UserController.updateUserById);

// DELETE a user by ID
protectedRouter.delete('/:id', UserController.deleteUserById);

module.exports = { router, protectedRouter };
