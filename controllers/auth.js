const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const connection = mysql.createConnection({
  host: "mysql.metropolia.fi",
  user: "jasmija",
  password: "jassumetropoliasql",
  database: "jasmija"
});

exports.register = (request, response) => {
  console.log(request.body);

  let { username, password, passwordConfirm } = request.body;

  // Check if database already has username or check if password confirmation doesn't match.
  connection.query('SELECT username FROM accounts WHERE username = ?', [username], async (error, results) => {
    if(error) {
      console.log(error);
    }
    if(results.length > 0) {
      console.log('Username taken!')
      return response.sendFile('signup.html', { root: './'});
    }
    else if(password !== passwordConfirm) {
      console.log('Passwords do not match!')
      return response.sendFile('signup.html', { root: './'});
    }

    // Hash user password with 8 cycles.
    let hashedPassword = await bcrypt.hash(password, 8);
    console.log('Hashed password: ' + hashedPassword);

    connection.query('INSERT INTO accounts SET ?', { username: username, password: hashedPassword },  (error, results) => {
      if(error) {
        console.log(error)
      }
      else {
        console.log('User "' + username +  '" created!')
        return response.sendFile('signup.html', { root: './'});
      }
    })
  })
}
