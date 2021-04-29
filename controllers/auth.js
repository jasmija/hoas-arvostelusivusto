const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const connection = mysql.createConnection({
  host: 'mysql.metropolia.fi',
  user: 'jasmija',
  password: 'jassumetropoliasql',
  database: 'jasmija',
});

// Code for login.hbs
exports.login = async (request, response) => {
  try {
    const {username, password} = request.body;

    if (!username || !password) {
      return response.status(400).render('../login', {
        message: 'Käyttäjänimi ja/tai salasana puuttuu!',
      });
      // Old code. If we decide to use handlebars for the rest of the project, these can be deleted.
      /*
      console.log('Username and/or password missing!');
      return response.sendFile('login.hbs', {root: './'});
      */
    }
    connection.query('SELECT * FROM accounts WHERE username = ?', [username],
        async (error, results) => {
          console.log(JSON.stringify(results));
          if(results.length < 1) {
            return response.status(401).render('../login', {
              message: 'Käyttäjänimi tai salasana väärin!',
            });
          }
          if (!results ||
              !(await bcrypt.compare(password, results[0].password))) {
            return response.status(401).render('../login', {
              message: 'Käyttäjänimi tai salasana väärin!',
            });
        } else {
            const id = results[0].id;
            const token = jwt.sign({id}, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN
            })

            console.log('The token is: ' + token)

            const cookieOptions = {
              expires: new Date(
                  Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true
            }

            response.cookie('jwt', token, cookieOptions)
            response.status(200).redirect('/')

          }
          // Old code. If we decide to use handlebars for the rest of the project, these can be deleted.
          /*
          console.log('Username or password wrong!');
          return response.sendFile('login.hbs', {root: './'});
          */
        });
  } catch (error) {
    console.log(error);
  }
};



// Code for signup.hbs
exports.register = (request, response) => {
  console.log(request.body);

  let {username, password, passwordConfirm} = request.body;

  // Check if database already has username or check if password confirmation doesn't match.
  connection.query('SELECT username FROM accounts WHERE username = ?',
      [username], async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          return response.render('../signup', {
            message: 'Käyttäjänimi on jo olemassa!',
          });
          // Old code. If we decide to use handlebars for the rest of the project, these can be deleted.
          /*
          console.log('Username taken!');
          return response.sendFile('signup.hbs', {root: './'});
          */
        } else if (password !== passwordConfirm) {
          return response.render('../signup', {
            message: 'Salasanat eivät täsmää!',
          });
          // Old code. If we decide to use handlebars for the rest of the project, these can be deleted.
          /*
          console.log('Passwords do not match!');
          return response.sendFile('signup.hbs', {root: './'});
          */
        }

        // Hash user password with 8 cycles.
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log('Hashed password: ' + hashedPassword);

        // If checks are ok, add user to database.
        connection.query('INSERT INTO accounts SET ?',
            {username: username, password: hashedPassword},
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                console.log('User "' + username + '" created!');
                return response.render('../signup', {
                  message2: 'Käyttäjä luotiin onnistuneesti!'
                })
                // Old code. If we decide to use handlebars for the rest of the project, this can be deleted.
                //return response.sendFile('signup.hbs', {root: './'});
              }
            });
      });
};

exports.isLoggedIn = async (request, response, next) => {
  console.log(request.cookies);
  if (request.cookies.jwt) {
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(request.cookies.jwt,
          process.env.JWT_SECRET);

      console.log(decoded);

      // Check if user still exists
      connection.query('SELECT * FROM accounts WHERE id = ?', [decoded.id], (error, result) => {
        console.log(result);

        if(!result) {
          return next();
        }
        request.user = result[0];
        return next();
      })
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
}

exports.logout = async (request, response) => {
  response.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true
  });
  response.status(200).redirect('/');
}
