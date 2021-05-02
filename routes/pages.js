const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// Send static file "signup.hbs" to client when browsing at "http://localhost:3000/register"
router.get('/register', (request, response) => {
  response.render('../signup');
});

// Send static file "login.hbs" to client when browsing at "http://localhost:3000/login"
router.get('/login', (request, response) => {
  response.render('../login');
});

router.get('/', authController.isLoggedIn, (request, response) => {
  if (request.user) {
    response.render('../main.hbs', {
      user: request.user,
    });
  } else {
    response.render('../main.hbs')
  }
});

module.exports = router;
