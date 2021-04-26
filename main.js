
//*** BELOW ONLY CONNECTION TO DATABASE AND REST RELATED STUFF ***//

// Modules to use
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

// Add database connection details to variable "connection"
const connection = mysql.createConnection({
  host: "mysql.metropolia.fi",
  user: "jasmija",
  password: "jassumetropoliasql",
  database: "jasmija"
});

var util = require('util');
const res = require("express");
const query = util.promisify(connection.query).bind(connection);

const app = express();

// Listen to port 3000
app.listen(3000, () => console.log('Listening at port 3000'));

// Needed for css and images to work
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Send static file "main.html" to client when browsing at "http://localhost:3000/"
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/main.html'));
});

// Send static file "signup.html" to client when browsing at "http://localhost:3000/register"
app.get('/register', (request, response) => {
  response.sendFile(__dirname + '/signup.html');
});

// Send static file "login.html" to client when browsing at "http://localhost:3000/login"
app.get('/login', (request, response) => {
  response.sendFile(__dirname + '/login.html');
});

// Work in progress
app.post('/auth', function(request, response) {
  const username = request.body.username;
  const password = request.body.password;
  // If both fields contain something, do if statement where database is checked for the values.
  if (username && password) {
    connection.query(
        'SELECT * FROM accounts WHERE username = ? AND password = ?',
        [username, password], function(error, results, fields) {
          if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = username;
            response.redirect('/home');
          } else {
            response.send('Salasana tai käyttäjätunnus väärin!');
          }
          response.end();
        });
    // If one field is empty, or both, send the following message.
  } else {
    response.send(
        'Käyttäjätunnus tai salasana puuttuu kirjautumiskentästä. Ehkä molemmat? Tarkasta. <br>' +
        ' (Normaalioloissa tavallisen käyttäjän ei kuuluisi nähdä tätä sivua. Kirjautumiskenttien pitäisi tarkastaa että molemmissa on' +
        ' edes jotain kirjoitettuna).');
    response.end();
  }
});

app.get('/home', function(request, response) {
  if (request.session.loggedin) {
    response.sendFile(__dirname + '/main.html');
  } else {
    response.send('Kirjaudu sisään nähdäksesi tämän sivun.');
  }
});

var url = require('url');
//GET REVIEWS FROM DATABASE
app.get("/api/results", function (req, res) {
  console.log("Get values from database");
  var q = url.parse(req.url, true).query;
  var id = q.id;
  var string;

  var sql = "SELECT Arvostelut.id, Arvostelut.osoite, Arvostelut.kunto, Arvostelut.viihtyvyys, Arvostelut.kokonaisarvosana, Arvostelut.vapaasana"
      + " FROM Arvostelut"
      + " WHERE id= ?";

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql,[id]);
      string = JSON.stringify(rows);
      console.log(string);
      res.send(string);
    }
    catch (err) {
      console.log("Database error!"+ err);
    }
    finally {
      //conn.end();
    }
  })()
});

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for reading JSON

//INSERT REVIEWS TO DATABASE
app.post("/api/insert", urlencodedParser, function (req, res) {

  //console.log("Request body: " + req.body);
  //console.log("Request body length: " + req.body.getLength);

  console.log("Inside post");
  console.log("body: %j", req.body);

  // get JSON-object from the http-body
  let jsonObj = req.body;
  console.log("Arvo: " + jsonObj.Name);

  // make updates to the database
  let responseString = JSON.stringify(jsonObj)
  res.send("POST succesful: " + responseString);

    var sql = "INSERT INTO Arvostelut (osoite, kunto, viihtyvyys, kokonaisarvosana, vapaasana) VALUES ( ?, ?, ?, ?, ?)";

    (async () => {
      try {
        const result = await query(sql, [jsonObj.osoite, jsonObj.kunto, jsonObj.viihtyvyys, jsonObj.kokonaisarvosana, jsonObj.vapaasana]);

        let insertedId = result.insertId;
        console.log(result);
        console.log("insertedid " + insertedId);

      } catch (err) {
        console.log("Insertion into tables was unsuccessful!" + err);
        res.send("POST was not succesful " + err);
      }
    })()
});
