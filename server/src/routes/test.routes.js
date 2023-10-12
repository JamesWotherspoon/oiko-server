const express = require('express');
const router = express.Router();

router.get('', (req, res) => res.status(200).send('Testing!'));

router.post('/jsonParser', (req, res, next) => {
  const jsonValue = req.body.key;
  res.status(200).send(jsonValue);
  next();
});

router.get('/cookieParser', (req, res) => {
  const cookieValue = req.cookies.testCookie;
  res.status(200).send(cookieValue);
});

module.exports = router;
