// Modules to use
const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// Load /controllers/auth.js register function when browsing at /register
router.post('/register', authController.register)

// Load /controllers/auth.js login function when browsing at /login
router.post('/login', authController.login);

// Load /controllers/auth.js logout function when logging out
router.get('/logout', authController.logout);

// Export the variable router
module.exports = router;
