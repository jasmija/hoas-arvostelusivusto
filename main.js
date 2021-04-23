function addToList() {
  const title = document.getElementById('title').value;
  console.log(title);

  const li = document.createElement('li');
  li.innerHTML = title + '<br>';

  const chat = document.getElementById('chat');
  chat.appendChild(li);
}

/*function findText() {
    const input = document.getElementById('search').value;
    console.log(input);
    alert("String " + input + " found? " + window.find(input));
}*/

function searchApartment() {
  let input, uppercase, ul, li, h3, i, text;

  //Get search input field
  input = document.getElementById('search');

  //Input value to uppercase
  uppercase = input.value.toUpperCase();

  //List of apartments
  ul = document.getElementById('apartments');
  li = ul.getElementsByTagName('li');
  for (i = 0; i < li.length; i++) {
    h3 = li[i].getElementsByTagName('h3')[0];
    text = h3.innerText;
    if (text.toUpperCase().indexOf(uppercase) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
}

if (typeof window !== 'undefined') {
  window.onload = function() {

//Get the modal
    const modal = document.getElementById('modal');

//Get the button that opens the modal
    const btn = document.getElementById('ratings');

//Get the <span> element that closes the modal
    const span = document.getElementsByClassName('close')[0];

//Open the modal, when the user clicks the kirjaudu button
    btn.onclick = function() {
      modal.style.display = 'block';
    };

//Close the modal, when the user clicks on <span> (x)
    span.onclick = function() {
      modal.style.display = 'none';
    };

//Close modal, when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  };

  // Main page "log in pop-up" functions
  function visibleLogin() {
    const isloginopen = document.getElementById('login_wrap').style.visibility;
    console.log(isloginopen);
    if (isloginopen === 'visible') {
      document.getElementById('login_wrap').style.visibility = 'hidden';
      document.getElementById('login_wrap').style.display = 'none';
    } else {
      document.getElementById('login_wrap').style.visibility = 'visible';
      document.getElementById('login_wrap').style.display = 'block';
    }
  }

  function hideLogin() {
    document.getElementById('login_wrap').style.visibility = 'hidden';
  }

  /*CTRL F SEARCH FROM PAGE*/
  /*function findText() {
      const input = document.getElementById('search').value;
      console.log(input);
      alert("String " + input + " found? " + window.find(input));
  }*/

//SERVER JS
  let json; //json is global...

  function makeQuery() {
    const id = document.getElementById('searchid').value;
    if (id.length === 0) { // fix this and support empty field
    } else {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          json = JSON.parse(xmlhttp.responseText);
          console.log(json);
          //myFunction(resultArr);
          //document.getElementById("info").innerHTML = xmlhttp.responseText;
          if (json.length > 0) { // something found
            //console.log(json.length + ", " + json.rows[0].Name);
            showList(json);
          } else {
            document.getElementById(
                'rating').innerHTML = '<br/>Arvosteluita ei löytynyt yhtään.';
          }
        }
      };
      const searchedid = id;
      console.log('Haettu id: ' + searchedid);
      console.log('http://localhost:8084/api/results?id=' + searchedid);
      xmlhttp.open('GET', 'http://localhost:8084/api/results?id=' + searchedid,
          true);
      xmlhttp.send();
    }
  }

  function showList(json) {
    console.log('showList');

    const divElement = document.getElementById('rating');

    let i;
    let string;

    //var inputvalue = document.getElementsByTagName("input").value;
    //console.log("inputavalue " + inputvalue);
    for (i in json) {
      string = json[i].id + ', ' + json[i].osoite + ', ' + json[i].kunto +
          ', ' + json[i].viihtyvyys + ', ' + json[i].kokonaisarvosana + ', ' +
          json[i].vapaasana;
      divElement.innerHTML = string;
      console.log(string);
    }
  }
}

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
