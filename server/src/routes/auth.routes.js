const express = require('express');
const router = express.Router();
const {createUser} = require('../controllers/users/createUser');
const {loginUser} = require('../controllers/users/loginUser');

router.post('/login', (req, res) => {
  loginUser(req, res);
});

router.post('/register', (req, res) => {
  console.log('login request');
  createUser(req, res);
});

module.exports = router;
