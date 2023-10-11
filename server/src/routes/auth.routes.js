const express = require('express');
const { registerUser } = require('../controllers/auth/registerUser');
const { loginUser } = require('../controllers/auth/loginUser');

const router = express.Router();

router.post('/login', (req, res) => {
  loginUser(req, res);
});

router.post('/register', (req, res) => {
  registerUser(req, res);
});

router.post('/logout', (req, res) => {
  logoutUser(req, res);
});

const protectedRouter = express.Router();

protectedRouter.get('/status', (req, res) => {
  res.status(200).send('Valid Token!');
});

module.exports = { router, protectedRouter };
