
//*** BELOW ONLY CONNECTION TO DATABASE AND REST RELATED STUFF ***//

// Modules to use
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: './'})

// Add database connection details to variable "connection"
const connection = mysql.createConnection({
  host: "mysql.metropolia.fi",
  user: "jasmija",
  password: "jassumetropoliasql",
  database: "jasmija"
});

const util = require('util');
const res = require("express");
const query = util.promisify(connection.query).bind(connection);

const app = express();

// Listen to port 3000
app.listen(3000, () => console.log('Listening at port 3000'));

// Needed for css and images to work
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// ÄLÄ POISTA! Tutkin vielä tarviiks tätä. 26.4. 15:54
/*
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
*/

const url = require('url');
//GET REVIEWS FROM DATABASE
app.get("/api/results", function (req, res) {
  console.log("Get values from database");
  const q = url.parse(req.url, true).query;
  const id = q.id;
  let string;

  const sql = 'SELECT Arvostelut.id, Arvostelut.osoite, Arvostelut.kunto, Arvostelut.viihtyvyys, Arvostelut.kokonaisarvosana, Arvostelut.vapaasana'
      + ' FROM Arvostelut'
      + ' WHERE id= ?';

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
  })()
});

//GET CHATS FROM DATABASE
app.get("/chat", function (req, res) {
  console.log("Get values from database");
  var q = url.parse(req.url, true).query;
  var string;

  var sql = "SELECT chat.username, chat.header"
      + " FROM chat";

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql);
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
const urlencodedParser = bodyParser.urlencoded({extended: false});
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

  const sql = 'INSERT INTO Arvostelut (osoite, kunto, viihtyvyys, kokonaisarvosana, vapaasana) VALUES ( ?, ?, ?, ?, ?)';

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
