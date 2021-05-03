
//*** BELOW ONLY CONNECTION TO DATABASE AND REST RELATED STUFF ***//

// Modules to use
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({path: './.env'})

// Add database connection details to variable "connection"
const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

const util = require('util');
const res = require("express");
const query = util.promisify(connection.query).bind(connection);

const app = express();

app.set('view engine', 'hbs');

// Listen to port 3000
app.listen(3000, () => console.log('Listening at port 3000'));

// Needed for css and images to work
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

const url = require('url');
//GET REVIEWS FROM DATABASE
app.get("/api/results", function (req, res) {
  //console.log("Get values from database");
  const q = url.parse(req.url, true).query;
  const id = q.id;
  let string;

  //UUSI
  const sql = "SELECT apartments.address, reviews.id, reviews.shape, reviews.comfort, reviews.grade, reviews.free_word"
      + " FROM apartments, reviews"
      + " WHERE reviews.id = apartments.id"
      + " and reviews.id= ?";

  //TOIMIVA
  /*const sql = 'SELECT Arvostelut.id, Arvostelut.osoite, Arvostelut.kunto, Arvostelut.viihtyvyys, Arvostelut.kokonaisarvosana, Arvostelut.vapaasana'
      + ' FROM Arvostelut'
      + ' WHERE id= ?';*/

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql,[id]);
      string = JSON.stringify(rows);
      //console.log(string);
      res.send(string);
    }
    catch (err) {
      console.log("Database error! In first get!!! "+ err);
    }
  })()
});

//GET CHATS FROM DATABASE
app.get("/chat", function (req, res) {
  //console.log("Get values from database");
  var q = url.parse(req.url, true).query;
  var string;

  var sql = "SELECT chat.username, chat.header"
      + " FROM chat";

  (async () => { // IIFE (Immediately Invoked Function Expression)
    try {
      const rows = await query(sql);
      string = JSON.stringify(rows);
      //console.log(string);
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
const urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for reading JSON


//INSERT CHATS TO DATABASE
app.post("/addchat", urlencodedParser, function (req, res) {

  console.log("INSIDE APP.POST CHÄTTI");
  let json = req.body;
  console.log("Stringinä chätti" + JSON.stringify(json));
  console.log("Request body chätti: " + req.body);
  console.log("Id chätti: " + json.id);

  let chatti = JSON.stringify(json);
  console.log("jsonObj " + chatti);
  res.send("POST succesful: " + chatti);

  const sql = 'INSERT INTO chat (username, header) VALUES ( ?, ?)';

  (async () => {
    try {
      console.log("inside async chat");
      await query(sql, [json.username, json.header]);
      console.log("result header " + [json].header);
      //let insertedId = result.insertId;
      //console.log("result is " + result);
      //console.log("insertedid " + insertedId);
      console.log("ennen post successful");
      res.send("POST succesful: " + req.body);
      console.log("async lopussa");


    } catch (err) {
      console.log("Insertion into tables was unsuccessful!" + err);
      res.send("POST was not succesful " + err);
    }
  })()
});

//INSERT REVIEWS TO DATABASE
app.post("/action", urlencodedParser, function (req, res) {

  console.log("INSIDE APP.POST!!!!!");

  let jsonObj = req.body;
  console.log("String" + JSON.stringify(jsonObj));
  console.log("Request body: " + req.body);
  console.log("Id: " + jsonObj.id);
  console.log("Shape: " + jsonObj.shape);

  let responseString = JSON.stringify(jsonObj);
  console.log("jsonObj " + responseString);
  res.send("POST succesful: " + responseString);

  const sql = 'INSERT INTO reviews (id, shape, comfort, grade, free_word) VALUES ( ?, ?, ?, ?, ?)';

  (async () => {
      try {
        console.log("inside async");
        const result = await query(sql, [jsonObj.id, jsonObj.shape, jsonObj.comfort, jsonObj.grade, jsonObj.free_word]);
        console.log("result id " + result[jsonObj].id);
        let insertedId = result.insertId;
        console.log("result is " + result);
        console.log("insertedid " + insertedId);
        res.send("POST succesful: " + req.body);

      } catch (err) {
        console.log("Insertion into tables was unsuccessful!" + err);
        //res.send("POST was not succesful " + err);
      }
    })()
});
