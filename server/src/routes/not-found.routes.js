const express = require('express')
const router = express.Router()

// Catch all unmatched routes
router.use((req, res, next) => {
  const error = new Error('Route Not Found')
  error.status = 404
  next(error)
})

// Handle error response
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({ // Error status (404 - route not found) or 500 - internal server error
    error: {
      message: err.message || 'Internal Server Error'
    }
  })
})

module.exports = router
