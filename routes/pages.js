// Modules to use
const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// Render signup.hbs to client when browsing at http://localhost:3000/register
router.get('/register', (request, response) => {
  response.render('../signup');
});

// Render login.hbs to client when browsing at http://localhost:3000/login
router.get('/login', (request, response) => {
  response.render('../login');
});

// Render main.hbs to client when browsing at http://localhost:3000/
// If logged in cookie is installed, send a message with render
router.get('/', authController.isLoggedIn, (request, response) => {
  if (request.user) {
    response.render('../main.hbs', {
      user: request.user,
    });
  } else {
    response.render('../main.hbs')
  }
});

// Export the variable router
module.exports = router;
