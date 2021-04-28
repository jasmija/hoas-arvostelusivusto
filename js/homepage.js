function addNewChat() {
  const title = document.getElementById('chatTitle').value;
  console.log(title);

  const li = document.createElement('li');
  li.innerHTML = title + "<br>";

  const chat = document.getElementById('chat');
  chat.appendChild(li);
}

function openChat() {
  var ischatopen = document.getElementById('chatcontents').style.visibility;
  console.log(ischatopen);

  if (ischatopen === "visible") {
    document.getElementById('chatcontents').style.visibility = "hidden";
    document.getElementById('chatcontents').style.display = "none";
  } else {
    document.getElementById('chatcontents').style.visibility = "visible";
    document.getElementById('chatcontents').style.display = "block";
  }
}

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

function getApartmentId(clicked_id){
  console.log("clicked id " + clicked_id);
  return clicked_id;
}

window.onload = function(){

  makeQueryForChat();

  //VIEW REVIEWS

  //Get the modal
  var modal = document.getElementById("modal");
  var apartments = document.getElementsByClassName('review');

  for(var i = 0; i < apartments.length; i++) {
    //console.log("apartments lenght " + apartments.length);
    //var apartment = i;
    //console.log(apartments[i]);
    //console.log("monesko alkio klikattu " + apartment);

    apartments[i].getApartmentId = function (i) {
      console.log("klikattu asunto " + i);
      //apartment = getApartmentId();
      //console.log("getapartmentid " + apartment);
      makeQueryForShowReviews(i);
      modal.style.display = "block";
    }
  }

  //Close the modal, when the user clicks on <span> (x)
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    $('.del').remove();
    modal.style.display = "none";
  }

  //Close modal, when the user clicks anywhere outside of the modal
  //Ei toimi mut en tiiä miks ???
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  //ADD REVIEW
  var modal2 = document.getElementById("modal2");
  var ratebuttons = document.getElementsByClassName("rate");

  for(var a = 0; a < ratebuttons.length; a++) {
    ratebuttons[a].getApartmentId = function (a) {
      console.log("klikattu asunto " + a);
      makeQueryForAddNewReview(a);
      modal2.style.display = "block";
    }
  }

  var span2 = document.getElementsByClassName("close2")[0];
  ratebuttons.onclick = function() {
    getApartmentId();
    modal2.style.display = "block";
  }

  span2.onclick = function() {
    modal2.style.display = "none";
  }

  //Tää toimii mut toinen samanlainen ei toimi??
  window.onclick = function(event) {
    if (event.target == modal2) {
      modal2.style.display = "none";
    }
  }
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

  var i;
  var reviewlist;
  var listElement;
  var string;

  for (i in json) {
    const searchresult = document.getElementById('rating');
    const divElement = document.getElementById('review');

    reviewlist = document.createElement("ul");
    reviewlist.setAttribute("class", "del");
    divElement.appendChild(reviewlist);

    listElement = document.createElement("li");
    listElement.setAttribute("class", "del");

    string = json[i].address + ', ' + json[i].shape + ', ' + json[i].comfort + ', ' + json[i].grade + ', ' + json[i].free_word;
    listElement.innerHTML = string;
    searchresult.innerHTML = string;
    reviewlist.appendChild(listElement);
  }
}

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
  let i;
  let string;

  for (i in json) {
    string = json[i].username + ', ' + json[i].header;
    console.log(string);

    const chat = document.getElementById('chat');
    const newheader = document.createElement('li');
    chat.appendChild(newheader);

    stringheader = json[i].header;
    newheader.innerHTML = stringheader;
  }
}

function makeQueryForAddNewReview(apartment) {

  const id = apartment;
  console.log(id);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      if (json.length > 0) { // something found
        showAddReview(json);
      } else {
        document.getElementById(
            'apartmentaddress').innerHTML = '<br/>Ei löytynyt asunnon osoitetta.';
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

function showAddReview(json) {
  console.log('showAddReview');

  const addrress = document.getElementById('apartmentaddress');
  let stringaddress;

  let i;
  let string;

  for (i in json) {
    string = json[i].id + ', ' + json[i].address + ', ' + json[i].shape +
        ', ' + json[i].comfort + ', ' + json[i].grade + ', ' +
        json[i].free_word;

    stringaddress = json[i].address;
    addrress.innerHTML = stringaddress;

    console.log(string);
  }
}
