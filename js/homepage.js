/** Window onload execute immediately after the page loaded */
window.onload = function() {

  //Get all apartments from database
  makeQueryForApartments();

  //Get input field for search apartment
  document.getElementById('search').value = '';

  //Load chats from database to page
  makeQueryForChat();

  //VIEW REVIEWS

  //Get the modal
  const modal = document.getElementById('modal');
  const apartments = document.getElementsByClassName('review');

  //Close the modal, when the user clicks on x
  const span = document.getElementsByClassName('close')[0];
  span.onclick = function() {
    modal.style.display = 'none';
  };

  //Display modal when user clicks partments image
  apartments.onclick = function (){
    modal.style.display = 'block';
  }

  //ADD REVIEW

  //Get the modal
  const modal2 = document.getElementById('modal2');
  const ratebuttons = document.getElementsByClassName('rate');

  //Close the modal, when the user clicks on x
  const span2 = document.getElementsByClassName('close2')[0];
  span2.onclick = function() {
    modal2.style.display = 'none';
  };

  //Display modal when user clicks ratebutton
  ratebuttons.onclick = function() {
    modal2.style.display = 'block';
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

/** Search apartment from page by address */
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

/** Get all apartments from database */
function makeQueryForApartments(){
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      if (json.length > 0) {
        showApartments(json);
        showApartments2(json);
      } else {
        console.log("Ei löytynyt yhtäkään asuntoa");
      }
    }
  };
  console.log('http://localhost:3000/api/apartments');
  xmlhttp.open('GET', 'http://localhost:3000/api/apartments', true);
  xmlhttp.send();
}

/**
 * All the apartments retrieved from the database are displayed in a list on the page
 * @param {json} json - json of apartments retrieved from the database
 */
function showApartments(json){
  let i;
  let address;
  let id;

  for (i in json) {
    address = json[i].address;
    id = json[i].id;

    const apartmentlist = document.getElementsByClassName('review');
    const figcaptions = document.getElementsByClassName('header');
    const ratebuttons = document.getElementsByClassName('rate');

    figcaptions[i].innerHTML = address;

    apartmentlist[i].setAttribute('id', id);
    apartmentlist[i].setAttribute('onclick', 'makeQueryForShowReviews(' + id + ')');
    //ratebuttons[i].setAttribute('onclick', 'makeQueryForAddNewReview(' + id + ')');
  }
}

function showApartments2(){
  let i;
  let address;
  let id;

  for (i in json) {
    address = json[i].address;
    id = json[i].id;

    const apartmentlist = document.getElementsByClassName('review');
    const figcaptions = document.getElementsByClassName('header');
    const ratebuttons = document.getElementsByClassName('rate');

    figcaptions[i].innerHTML = address;

    apartmentlist[i].setAttribute('id', id);
    apartmentlist[i].setAttribute('onclick', 'makeQueryForShowReviews(' + id + ')');
    ratebuttons[i].setAttribute('onclick', 'makeQueryForAddNewReview(' + id + ')');
  }
}

/**
 * Get the clicked apartment address from database to display the address in the header of the form
 * @param {int} id - id of clicked apartment
 */
function makeQueryForAddNewReview(id) {
  const apartment = id;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      showAddReview(json);
      if (json.length > 0) {
      } else {
        document.getElementById('apartmentaddress').innerHTML = '<br/>Ei löytynyt asunnon osoitetta.';
      }
    }
  };
  console.log('http://localhost:3000/api/address?id=' + apartment);
  xmlhttp.open('GET', 'http://localhost:3000/api/address?id=' + apartment, true);
  xmlhttp.send();
}

/**
 * Get apartment address and id to review form
 *  @param {json} json - apartments address and id from database
 */
function showAddReview(json) {

  const modal2 = document.getElementById('modal2');
  modal2.style.display = 'block';

  const addrress = document.getElementById('apartmentaddress');

  const id = document.getElementById('idvalue');

  let stringaddress;
  let idstring;
  let i;
  let string;

  for (i in json) {
    string = json[i].id + ', ' + json[i].address + ', ' + json[i].shape +
        ', ' + json[i].comfort + ', ' + json[i].grade + ', ' +
        json[i].free_word;

    stringaddress = json[i].address;
    addrress.innerHTML = stringaddress;

    idstring = json[i].id;
    id.innerHTML = idstring;
  }
}

//QUERIES TO THE DATABASE
let json;

/**
 * Get clicked apartments reviews from database
 * @param {int} id - id of clicked apartment
 */
function makeQueryForShowReviews(id) {

  const apartment = id;
  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      if (json.length > 0) { // something found
        openReviews(id);
      } else {
        document.getElementById('rating').innerHTML = '<br/>Arvosteluita ei löytynyt yhtään.';
      }
    }
  };
  console.log('http://localhost:3000/api/results?id=' + apartment);
  xmlhttp.open('GET', 'http://localhost:3000/api/results?id=' + apartment,
      true);
  xmlhttp.send();
}

/**
 * Open clicked apartments reviews in list
 * @param {int} id - id of clicked apartment
 */
function openReviews(id){

  const modal = document.getElementById('modal');
  modal.style.display = 'block';

  const container = document.getElementById('container');
  container.innerHTML = '';

  let i;
  for (i in json) {
    const header = document.getElementById('header');

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
    p.innerHTML = json[i].shape;
    p2.innerHTML = json[i].comfort;
    p3.innerHTML = json[i].grade;
    p4.innerHTML = json[i].free_word;
  }
  countAverage(json);
}

/**
 * Calculate the average of the apartments reviews
 * @param {json} json - json of reviews retrieved from the database
 */
function countAverage(json) {

  let sumcomfort = 0;
  let sumgrade = 0;
  let sumshape = 0;

  for (let i = 0; i < json.length; i++) {
    sumcomfort = sumcomfort + json[i].comfort;
    sumgrade = sumgrade + json[i].grade;

    if (json[i].shape === 'Välttävä') {
      json[i].shape = 1;
    } else if (json[i].shape === 'Tyydyttävä') {
      json[i].shape = 2;
    } else if (json[i].shape === 'Hyvä') {
      json[i].shape = 3;
    } else if (json[i].shape === 'Kiitettävä') {
      json[i].shape = 4;
    } else if (json[i].shape === 'Erinomainen') {
      json[i].shape = 5;
    }
    sumshape = sumshape + json[i].shape;
  }

  const averageshape = (sumshape / json.length).toFixed(0);
  const averagecomfort = (sumcomfort / json.length).toFixed(0);
  const averagegrade = (sumgrade / json.length).toFixed(0);

  document.getElementById('averageshape').innerHTML = averageshape.toString();
  document.getElementById('averagecomfort').innerHTML = averagecomfort.toString();
  document.getElementById('averagegrade').innerHTML = averagegrade.toString();
}

/** Send review form */
function makeQueryForSendForm() {

  alert("Arvostelu vastaanotettu!");
  const id = document.getElementById('idvalue').innerText;
  const shape = document.getElementById('shape').value;
  const comfort = document.getElementById('comfort').value;
  const grade = document.getElementById('grade').value;
  const free_word = document.getElementById('free_word').value;

  const newReview = '{"id": "' + id + '", "shape": "' + shape +
      '", "comfort": "' + comfort + '", "grade": "' + grade +
      '", "free_word": "' +
      free_word + '"}';

  const xmlhttp = new XMLHttpRequest();

  console.log('http://localhost:3000/api/sendform');
  xmlhttp.open('POST', 'http://localhost:3000/api/sendform', true);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
  xmlhttp.send(newReview);
}

//CHAT
/** Get all chats from database when page loading */
function makeQueryForChat() {

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      if (json.length > 0) {
        showChat(json);
      } else {
        console.log("Yhtään chattiä ei löytynyt!");
      }
    }
  };
  console.log('http://localhost:3000/chat');
  xmlhttp.open('GET', 'http://localhost:3000/chat', true);
  xmlhttp.send();
}

/**
 * Dispaly list of chats from database
 * @param {json} json - chat header and username from database
 */
function showChat(json) {

  let stringheader;
  let stringusername;
  let i;
  let string;

  for (i in json) {
    string = json[i].username + ', ' + json[i].header;

    const chat = document.getElementById('chat');
    const newheader = document.createElement('li');

    var id = json[i].id;
    newheader.setAttribute('id', id);
    newheader.setAttribute('onclick', 'openChat(' + id + ')');

    chat.appendChild(newheader);
    stringheader = json[i].header;

    stringusername = json[i].username;
    newheader.innerHTML = stringheader + ' käyttäjä: ' + stringusername;
  }
}

/**
 * Open the clicked chat's answers
 * @param {int} id - id of clicked chat's header
 */
function openChat(id) {

  const container = document.getElementById('answers');
  container.innerHTML = '';

  //Get chat's header from the database
  makeQueryForChatHeader(id);

  //Get chat's answers from the database
  makeQueryForContent(id);

  const sendbutton = document.getElementById('sendbutton');
  sendbutton.setAttribute('onclick', 'makeQueryForSendAnswer(' + id + ')');

  const ischatopen = document.getElementById(id).style.visibility;

  if (ischatopen === 'visible') {
    document.getElementById('chatcontents').style.visibility = 'hidden';
    document.getElementById('chatcontents').style.display = 'none';
  } else {
    document.getElementById('chatcontents').style.visibility = 'visible';
    document.getElementById('chatcontents').style.display = 'block';
  }
}

/** Send new chat to database */
function makeQueryForSendChat() {

  if (document.getElementById('chatTitle').value === '') {
    alert('Täytä kenttä!!');
  } else {
    const header = document.getElementById('chatTitle').value;
    const user = document.getElementById('user').innerText;
    const newChat = '{"username": "' + user + '", "header": "' + header + '"}';

    const xmlhttp = new XMLHttpRequest();
    console.log('http://localhost:3000/addchat');
    xmlhttp.open('POST', 'http://localhost:3000/addchat', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.send(newChat);

    document.getElementById('chat').innerHTML = ' ';
    makeQueryForChat();
  }
}

/**
 * Send new answer to particular chat
 * @param {int} id - id of that chat where user is sending answer
 */
function makeQueryForSendAnswer(id) {

  if (document.getElementById('answer').value === '') {
    alert('Täytä kenttä!!');
  } else {
    var clicked_id = id;

    const answer = document.getElementById('answer').value;
    const newAnswer = '{"id_chat": "' + clicked_id + '", "answer": "' + answer +
        '"}';

    const xmlhttp = new XMLHttpRequest();
    console.log('http://localhost:3000/addchatanswer');
    xmlhttp.open('POST', 'http://localhost:3000/addchatanswer', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
    xmlhttp.send(newAnswer);

    document.getElementById('answer').value = '';
  }
}

/**
 * Get clicked chats id from database
 * @param {int} id - id of clicked chat's header
 */
function makeQueryForChatHeader(id) {

  var clicked_id = id;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      if (json.length > 0) { // something found
        showHeader();
      } else {
        console.log('Otsikkoa ei löytynyt!');
      }
    }
  };
  console.log('http://localhost:3000/chatheader?id=' + clicked_id);
  xmlhttp.open('GET', 'http://localhost:3000/chatheader?id=' + clicked_id, true);
  xmlhttp.send();
}

/** Show chat's header */
function showHeader() {

  let i;
  let stringheader;

  for (i in json) {
    var header = document.getElementById('chatheader');
    stringheader = json[i].header;
    header.innerHTML = stringheader;
  }
}

/**
 * Get chat's answers from the database
 * @param {int} id - id of clicked chat's header
 */
function makeQueryForContent(id) {

  var clicked_id = id;

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      if (json.length > 0) { // something found
        showContent();
      } else {
        console.log('Yhtään vastausta ei löytynyt!');
      }
    }
  };
  console.log('http://localhost:3000/chatcontent?id=' + clicked_id);
  xmlhttp.open('GET', 'http://localhost:3000/chatcontent?id=' + clicked_id, true);
  xmlhttp.send();
}

/** Show chat answers */
function showContent() {

  let i;
  let answer;

  for (i in json) {
    answer = json[i].answer;

    const newanswer = document.createElement('li');
    newanswer.className = 'chatanswers';

    const chatcontents = document.getElementById('answers');
    chatcontents.appendChild(newanswer);

    newanswer.innerHTML = answer;
  }
}




