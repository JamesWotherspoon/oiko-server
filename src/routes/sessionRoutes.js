const express = require('express');
const router = express.Router();
const protectedRouter = express.Router();
const { createSession, deleteSession, getSession } = require('../controllers/sessionController');
const sanitizeAndValidate = require('../middleware/sanitizeAndValidateMiddleware');
const { bodySchema } = require('../api-schemas/sessionApiSchema');
// Create session
router.post('/', sanitizeAndValidate('body', bodySchema), createSession);

// Delete session
protectedRouter.delete('/', deleteSession);

// Get session
protectedRouter.get('/', getSession);

module.exports = { router, protectedRouter };
