const express = require('express');
const router = express.Router();
const protectedRouter = express.Router();
const UserController = require('../controllers/user.controller');

// GET a single user by ID
protectedRouter.get('/:id', UserController.getUserById);

// CREATE a new user
router.post('/', UserController.createUser);

// UPDATE a user by ID
protectedRouter.put('/:id', UserController.updateUserById);

// DELETE a user by ID
protectedRouter.delete('/:id', UserController.deleteUserById);

module.exports = { router, protectedRouter };
