const express = require('express');

const router = express.Router();

// Send static file "main.html" to client when browsing at "http://localhost:3000/"
router.get('/', function(request, response) {
  response.sendFile('main.html', { root: './'});
});

// Send static file "signup.html" to client when browsing at "http://localhost:3000/register"
router.get('/register', (request, response) => {
  response.sendFile('signup.html', { root: './'});
});

// Send static file "login.html" to client when browsing at "http://localhost:3000/login"
router.get('/login', (request, response) => {
  response.sendFile('login.html', { root: './'});
});

module.exports = router;