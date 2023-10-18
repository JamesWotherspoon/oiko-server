const express = require('express');
const router = express.Router();
const protectedRouter = express.Router();
const { createSession, deleteSession, getSession } = require('../controllers/sessionController');

// Create session
router.post('/', createSession);

// Delete session
protectedRouter.delete('/', deleteSession);

// Get session
protectedRouter.get('/', getSession);

module.exports = { router, protectedRouter };
