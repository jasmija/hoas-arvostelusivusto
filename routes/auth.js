const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// Send static file "main.html" to client when browsing at "http://localhost:3000/"
router.post('/register', authController.register)

module.exports = router;