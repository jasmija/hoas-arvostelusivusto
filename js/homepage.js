/*async function refresh() {
  if (document.getElementById('chatTitle').value === '') {
  } else {
    await new Promise(r => setTimeout(() => r(), 500));
    window.location.reload();
  }
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

function getApartmentId(clicked_id) {
  console.log('clicked id ' + clicked_id);
  return clicked_id;
}

window.onload = function() {

  document.getElementById('search').value = '';

  makeQueryForChat();

  //VIEW REVIEWS

  //Get the modal
  const modal = document.getElementById('modal');
  const apartments = document.getElementsByClassName('review');

  for (let i = 0; i < apartments.length; i++) {
    //console.log("apartments lenght " + apartments.length);
    //var apartment = i;
    //console.log(apartments[i]);
    //console.log("monesko alkio klikattu " + apartment);

    apartments[i].getApartmentId = function(i) {
      console.log('klikattu asunto ' + i);
      //apartment = getApartmentId();
      //console.log("getapartmentid " + apartment);
      makeQueryForShowReviews(i);
      modal.style.display = 'block';
    };
  }

  //Close the modal, when the user clicks on <span> (x)
  const span = document.getElementsByClassName('close')[0];
  span.onclick = function() {
    $('.del').remove();
    modal.style.display = 'none';
  };

  //ADD REVIEW
  const modal2 = document.getElementById('modal2');
  const ratebuttons = document.getElementsByClassName('rate');

  for (let a = 0; a < ratebuttons.length; a++) {
    ratebuttons[a].getApartmentId = function(a) {
      console.log('klikattu asunto ' + a);
      makeQueryForAddNewReview(a);
      modal2.style.display = 'block';
    };
  }

  const span2 = document.getElementsByClassName('close2')[0];
  ratebuttons.onclick = function() {
    getApartmentId();
    modal2.style.display = 'block';
  };

  span2.onclick = function() {
    modal2.style.display = 'none';
  };

  // Close modal when user clicks outside the "pop up window".
  window.onclick = function(event) {
    if (event.target === modal2) {
      modal2.style.display = 'none';
    }
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
};

//SERVER JS
let json;

function makeQueryForShowReviews(apartment) {
  const id = apartment;
  console.log(id);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      if (json.length > 0) { // something found
        showReviewList(json);
      } else {
        document.getElementById(
            'rating').innerHTML = '<br/>Arvosteluita ei löytynyt yhtään.';
      }
    }
  };
  const searchedid = id;
  console.log('Haettu id: ' + searchedid);
  console.log('http://localhost:3000/api/results?id=' + searchedid);
  xmlhttp.open('GET', 'http://localhost:3000/api/results?id=' + searchedid,
      true);
  xmlhttp.send();
}

function showReviewList(json) {
  console.log('showReviewList');

  let i;
  let string;

  const container = document.getElementById('container');
  container.innerHTML = '';
  for (i in json) {
    const searchresult = document.getElementById('rating');

    /*var modal = document.getElementById("modal-content");
    var header = document.createElement("p");
    header.setAttribute("class", "del");
    modal.appendChild(header);*/

    const header = document.getElementById('header');
    //header.setAttribute("class", "del");

    //const container = document.getElementById("container");
    const div = document.createElement('div');
    div.setAttribute('id', 'review');
    div.setAttribute('class', 'del');
    container.appendChild(div);

    const h = document.createElement('h3');
    h.innerHTML = 'Kunto';
    div.appendChild(h);
    const p = document.createElement('p');
    div.appendChild(p);

    const h2 = document.createElement('h3');
    h2.innerHTML = 'Viihtyvyys';
    div.appendChild(h2);
    const p2 = document.createElement('p');
    div.appendChild(p2);

    const h3 = document.createElement('h3');
    h3.innerHTML = 'Kokonaisarvosana';
    div.appendChild(h3);
    const p3 = document.createElement('p');
    div.appendChild(p3);

    const h4 = document.createElement('h3');
    h4.innerHTML = 'Vapaa sana';
    div.appendChild(h4);
    const p4 = document.createElement('p');
    div.appendChild(p4);

    header.innerHTML = json[i].address;
    console.log('header inner html = ' + json[i].address);
    p.innerHTML = json[i].shape;
    p2.innerHTML = json[i].comfort;
    p3.innerHTML = json[i].grade;
    p4.innerHTML = json[i].free_word;
  }

  countAverage(json);
}

//COUNT AVERAGE
function countAverage(json) {

  let sumcomfort = 0;
  let sumgrade = 0;
  let sumshape = 0;

  for (let i = 0; i < json.length; i++) {
    sumcomfort = sumcomfort + json[i].comfort;
    sumgrade = sumgrade + json[i].grade;

    if (json[i].shape === 'välttävä') {
      json[i].shape = 1;
      console.log(json[i].shape);
    } else if (json[i].shape === 'Tyydyttävä') {
      json[i].shape = 2;
      console.log(json[i].shape);
    } else if (json[i].shape === 'Hyvä') {
      json[i].shape = 3;
      console.log(json[i].shape);
    } else if (json[i].shape === 'Kiitettävä') {
      json[i].shape = 4;
      console.log(json[i].shape);
    }

    sumshape = sumshape + json[i].shape;
    console.log('Summa kunnosta ' + sumshape);
  }

  const averageshape = (sumshape / json.length).toFixed(0);
  console.log('Keskiarvo kunto ' + averageshape);

  const averagecomfort = (sumcomfort / json.length).toFixed(0);
  console.log('Keskiarvo viihtyvyys ' + averagecomfort);

  const averagegrade = (sumgrade / json.length).toFixed(0);
  console.log('Keskiarvo kokonaisarvosana ' + averagegrade);

  //const shape = document.getElementById("averageshape");
  //shape.setAttribute("class", "del");
  document.getElementById('averageshape').innerHTML = averageshape.toString();
  document.getElementById(
      'averagecomfort').innerHTML = averagecomfort.toString();
  document.getElementById('averagegrade').innerHTML = averagegrade.toString();

  /*for (i in json) {
    const shape = json[i].comfort;
    console.log("Viihtyvyys " + json[i].comfort);
    sum += shape;
    console.log("Summa " + sum);
  }
  const averagecomfort = sum / i;
  console.log("Keskiarvo viihtyvyys " + averagecomfort);*/
}

//GET APARTMENT ADDRESS TO REVIEW FORM HEADER
function makeQueryForAddNewReview(apartment) {

  const id = apartment;
  console.log('Id !!!!!' + id);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      /*document.getElementById(
          'apartmentaddress').innerHTML = '<br/>Ei löytynyt asunnon osoitetta.';*/
      showAddReview(json);
      if (json.length > 0) { // something found
        showAddReview(json);
      } else {
        document.getElementById(
            'apartmentaddress').innerHTML = '<br/>Ei löytynyt asunnon osoitetta.';
        //makeQueryForAddress();
      }
    }
  };
  const searchedid = id;
  console.log('Haettu id: ' + searchedid);
  console.log('http://localhost:3000/api/address?id=' + searchedid);
  xmlhttp.open('GET', 'http://localhost:3000/api/address?id=' + searchedid,
      true);
  xmlhttp.send();
}

//GET APARTMENT ADDRESS TO REVIEW FORM HEADER
function showAddReview(json) {
  console.log('showAddReview');

  const addrress = document.getElementById('apartmentaddress');

  const id = document.getElementById('idvalue');
  let stringaddress;
  let idstring;

  let i;
  let string;

  for (i in json) {
    console.log('inside for loop showaddreview');
    string = json[i].id + ', ' + json[i].address + ', ' + json[i].shape +
        ', ' + json[i].comfort + ', ' + json[i].grade + ', ' +
        json[i].free_word;

    stringaddress = json[i].address;
    addrress.innerHTML = stringaddress;
    console.log('Osote pitäs olla tässä!!!! ' + stringaddress);

    idstring = json[i].id;
    id.innerHTML = idstring;

    console.log(string);
  }
}

//SEND REVIEW
function makeQueryForSendForm() {

  const id = document.getElementById('idvalue').innerText;
  console.log(id);
  // make a JSON string and send it to a server
  const shape = document.getElementById('shape').value;
  console.log(shape);
  const comfort = document.getElementById('comfort').value;
  console.log(comfort);
  const grade = document.getElementById('grade').value;
  console.log(grade);
  const free_word = document.getElementById('free_word').value;
  console.log(free_word);

  const newReview = '{"id": "' + id + '", "shape": "' + shape +
      '", "comfort": "' + comfort + '", "grade": "' + grade +
      '", "free_word": "' +
      free_word + '"}';

  document.getElementById('test2').innerHTML = newReview;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

      document.getElementById('test').innerHTML = xmlhttp.responseText;
    }
    /*if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log("Json " + json);
      if (json.length > 0) { // something found
        document.getElementById("test").innerHTML = json;
      } else {
      }
    }*/
  };
  console.log('http://localhost:3000/action');
  xmlhttp.open('POST', 'http://localhost:3000/action', true);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
  xmlhttp.send(newReview);

  document.getElementById('shape').value = 'Hyvä';
  document.getElementById('comfort').value = 3;
  document.getElementById('grade').value = 3;
  document.getElementById('free_word').value = '';
}

//CHÄTTI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function makeQueryForChat() {

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      if (json.length > 0) { // something found
        showChat(json);
      } else {
      }
    }
  };
  console.log('http://localhost:3000/chat');
  xmlhttp.open('GET', 'http://localhost:3000/chat', true);
  xmlhttp.send();
}

function showChat(json) {
  console.log('showChat');

  let stringheader;
  let stringusername;
  let i;
  let string;

  for (i in json) {
    string = json[i].username + ', ' + json[i].header;
    console.log(string);

    const chat = document.getElementById('chat');
    const newheader = document.createElement('li');

    var id = json[i].id;
    newheader.setAttribute('id', id);
    newheader.setAttribute('onclick', 'openChat(' + id + ')');

    console.log(id);
    //newheader.addEventListener("click", openChat(id), false);
    console.log('eventlistener added!!');
    //addParemetersToOpenChat(id);

    chat.appendChild(newheader);
    stringheader = json[i].header;
    //newheader.innerHTML = stringheader;
    stringusername = json[i].username;
    newheader.innerHTML = stringheader + " käyttäjä: " + stringusername;
    //addParemetersToOpenChat(id);
  }
}

function openChat(id) {

  const container = document.getElementById('answers');
  container.innerHTML = '';
  /*var chatcontents = document.getElementById("chatcontents");
  chatcontents.setAttribute("class", "del");
  $('.del').remove();*/

  console.log('Open chät sisällä!!!');
  console.log('id ' + id.toString());
  console.log(id);

  makeQueryForChatHeader(id);
  makeQueryForContent(id);

  const sendbutton = document.getElementById('sendbutton');
  sendbutton.setAttribute('onclick', 'makeQueryForSendAnswer(' + id + ')');

  const ischatopen = document.getElementById(id).style.visibility;
  console.log(ischatopen);

  if (ischatopen === 'visible') {
    document.getElementById('chatcontents').style.visibility = 'hidden';
    document.getElementById('chatcontents').style.display = 'none';
  } else {
    document.getElementById('chatcontents').style.visibility = 'visible';
    document.getElementById('chatcontents').style.display = 'block';
  }
}

//CHÄTIN OTSIKON LÄHETYS TOIMII
function makeQueryForSendChat() {

  if (document.getElementById('chatTitle').value === '') {
    alert("Täytä kenttä!!");
  } else {
    const header = document.getElementById('chatTitle').value;
    const user = document.getElementById('user').innerText;
    console.log('CHÄTIN OTSIKKO: ' + header);
    console.log('CHÄTIN KÄYTTÄJÄTUNNUS: ' + user);
    const newChat = '{"username": "' + user + '", "header": "' + header + '"}';
    console.log('Console loggina ' + newChat);

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        //addNewChat();
        //document.getElementById('testchat').innerHTML = xmlhttp.responseText;
      }
    };
    console.log('http://localhost:3000/addchat');
    xmlhttp.open('POST', 'http://localhost:3000/addchat', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.send(newChat);


    document.getElementById("chat").innerHTML = " ";
    makeQueryForChat();
  }
}


function makeQueryForSendAnswer(id) {

  if (document.getElementById('chatTitle').value === '') {
    alert("Täytä kenttä!!");
  } else {
    var clicked_id = id;

    //const id_chat = document.getElementById('chatid').value;
    const answer = document.getElementById('answer').value;

    console.log('CHÄTIN id: ' + clicked_id);

    const newAnswer = '{"id_chat": "' + clicked_id + '", "answer": "' + answer +
        '"}';
    console.log('Console loggina uusi vastaus chättiin ' + newAnswer);

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        //showChatAnswer();
        document.getElementById('testanswer').innerHTML = xmlhttp.responseText;
      }
    };
    console.log('http://localhost:3000/addchatanswer');
    xmlhttp.open('POST', 'http://localhost:3000/addchatanswer', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.send(newAnswer);

    document.getElementById('answer').value = '';
  }

}

//PARTICULAR CHAT FROM DATABASE
function makeQueryForChatHeader(id) {
  console.log('inside makeQueryForChatHeader');
  var clicked_id = id;
  console.log('klikattu id ' + clicked_id);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      if (json.length > 0) { // something found
        showHeader();
      } else {
        console.log('Yhtään otsikkoa ei löytynyt!:(( ');
      }
    }
  };
  console.log('http://localhost:3000/chatheader?id=' + clicked_id);
  xmlhttp.open('GET', 'http://localhost:3000/chatheader?id=' + clicked_id,
      true);
  xmlhttp.send();
}

function makeQueryForContent(id) {
  console.log('inside makeQueryForContent');
  var click = id;
  console.log('klikattu id on ' + click);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      if (json.length > 0) { // something found
        showContent();
      } else {
        console.log('Yhtään vastausta ei löytynyt!:(( ');
      }
    }
  };
  console.log('http://localhost:3000/chatcontent?id=' + click);
  xmlhttp.open('GET', 'http://localhost:3000/chatcontent?id=' + click, true);
  xmlhttp.send();
}

function showContent() {
  console.log('showContent');

  let i;
  let answer;

  for (i in json) {
    answer = json[i].answer;
    console.log(answer);

    const chatcontents = document.getElementById('answers');
    const newanswer = document.createElement('li');
    newanswer.className = "chatanswers";

    chatcontents.appendChild(newanswer);

    newanswer.innerHTML = answer;
  }

}

/*function makeQueryForShowReviews(apartment) {
  const id = apartment;
  console.log(id);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      if (json.length > 0) { // something found
        showReviewList(json);
      } else {
        document.getElementById('rating').innerHTML = '<br/>Arvosteluita ei löytynyt yhtään.';
      }
    }
  };
  const searchedid = id;
  console.log('Haettu id: ' + searchedid);
  console.log('http://localhost:3000/api/results?id=' + searchedid);
  xmlhttp.open('GET', 'http://localhost:3000/api/results?id=' + searchedid, true);
  xmlhttp.send();
}*/

function showHeader() {
  console.log('showHeader');

  let i;
  let stringheader;

  for (i in json) {
    var header = document.getElementById('chatheader');
    stringheader = json[i].header;
    header.innerHTML = stringheader;
  }

}

function showParticularChat(json) {
  console.log('showParticularChat');

  let i;
  let string;
  let stringanswer;

  for (i in json) {
    string = json[i].id_chat + ', ' + json[i].answer;
    console.log('Stringinä: ' + string);
    console.log('json answer ' + json[i].answer);

    const chatcontents = document.getElementById('chat');
    const newanswer = document.createElement('li');
    chatcontents.appendChild(newanswer);

    stringanswer = json[i].answer;
    console.log('stringanswer ' + json[i].answer);
    newanswer.innerHTML = stringanswer;
  }
}

function addNewChat() {
  /*const title = document.getElementById('chatTitle').value;
  console.log(title);

  const li = document.createElement('li');
  //li.addEventListener('click', openChat, false);
  li.innerHTML = title + '<br>';

  const chat = document.getElementById('chat');
  chat.appendChild(li);*/

}



