// Modules to use
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {promisify} = require('util');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

/** Code for login.
 * 1) Check if username or password field is empty.
 * 2) If true, send error message. If false, send SQL query to database.
 * 3) If username can't be found in database, send error message.
 * 4) If username or password don't exist in database, send error message.
 * 5) If username and password are both ok, set a cookie to client browser and redirect to home page.
 * */
exports.login = async (request, response) => {
  try {
    const {username, password} = request.body;

    if (!username || !password) {
      return response.status(400).render('../login', {
        message: 'Käyttäjänimi ja/tai salasana puuttuu!',
      });
    }
    connection.query('SELECT * FROM accounts WHERE username = ?', [username],
        async (error, results) => {
          if (results.length < 1) {
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
              expiresIn: process.env.JWT_EXPIRES_IN,
            });
            const cookieOptions = {
              expires: new Date(
                  Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 *
                  1000,
              ),
              httpOnly: true,
            };

            response.cookie('jwt', token, cookieOptions);
            response.status(200).redirect('/');

          }
        });
  } catch (error) {
    console.log(error);
  }
};

/** Code for signup.hbs
 * 1) Send SQL query to database to search if entered username already exists.
 * 2) If true, send error message. If false, check that passwords match.
 * 3) If false, send error message. If true, hash password, insert username and hashed password in to database and send success message to client.
 */
exports.register = (request, response) => {
  let {username, password, passwordConfirm} = request.body;

  connection.query('SELECT username FROM accounts WHERE username = ?',
      [username], async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          return response.render('../signup', {
            message: 'Käyttäjänimi on jo olemassa!',
          });
        } else if (password !== passwordConfirm) {
          return response.render('../signup', {
            message: 'Salasanat eivät täsmää!',
          });
        }

        // Hash user password with 8 cycles.
        let hashedPassword = await bcrypt.hash(password, 8);


        connection.query('INSERT INTO accounts SET ?',
            {username: username, password: hashedPassword},
            (error, results) => {
              if (error) {
                console.log(error);
              } else {
                console.log('User "' + username + '" created!');
                return response.render('../signup', {
                  message2: 'Käyttäjä luotiin onnistuneesti!',
                });
              }
            });
      });
};

/**
 * 1) Check for cookie called "jwt" and verify it.
 * 2) Check if user still exists.
 * 3) If result from query is false, render main page.
 * 4) Create variable user and set the result from query as the value.
 * 5) Return next() to render main.hbs.
 */
exports.isLoggedIn = async (request, response, next) => {
  if (request.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(request.cookies.jwt,
          process.env.JWT_SECRET);
      connection.query('SELECT * FROM accounts WHERE id = ?', [decoded.id],
          (error, result) => {
            if (!result) {
              return next();
            }
            request.user = result[0];
            return next();
          });
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
};

/**
 * When user logs out, replace logged in cookie with no value and make it expire after 2 seconds.
 */
exports.logout = async (request, response) => {
  response.cookie('jwt', '', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  response.status(200).redirect('/');
};
