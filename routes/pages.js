const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

/*
// Send static file "main.hbs" to client when browsing at "http://localhost:3000/"
router.get('/', function(request, response) {
  response.render('../main.hbs');
});
 */

// Send static file "signup.hbs" to client when browsing at "http://localhost:3000/register"
router.get('/register', (request, response) => {
  response.render('../signup');
});

// Old code. If we decide to use handlebars for the rest of the project, these can be deleted.
/*
router.get('/register', (request, response) => {
  response.sendFile('signup.hbs', { root: './'});
});
*/

// Send static file "login.hbs" to client when browsing at "http://localhost:3000/login"
router.get('/login', (request, response) => {
  response.render('../login');
});

// Old code. If we decide to use handlebars for the rest of the project, these can be deleted.
/*
router.get('/login', (request, response) => {
  response.sendFile('login.hbs', { root: './'});
});
*/

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
