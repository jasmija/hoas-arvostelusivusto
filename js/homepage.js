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
    console.log("apartments lenght " + apartments.length);
    var apartment = i;
    console.log(apartments[i]);
    console.log("monesko alkio klikattu " + apartment);

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
    modal.style.display = "none";
  }

  //Close modal, when the user clicks anywhere outside of the modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  //ADD REVIEW
  var modal2 = document.getElementById("modal2");
  console.log("after get modal");

  var ratebuttons = document.getElementsByClassName("rate");
  console.log("after get arvostele button");

  for(var a = 0; a < ratebuttons.length; a++) {
    console.log("apartments lenght " + ratebuttons.length);
    var ratebutton = a;
    console.log(ratebuttons[a]);
    console.log("monesko alkio klikattu " + ratebutton);

    ratebuttons[a].getApartmentId = function (a) {
      console.log("klikattu asunto " + a);
      //apartment = getApartmentId();
      //console.log("getapartmentid " + apartment);
      makeQueryForAddNewReview(a);
      modal2.style.display = "block";
    }

  }

  var span2 = document.getElementsByClassName("close2")[0];
  console.log("after get close");

  ratebuttons.onclick = function() {
    getApartmentId();
    console.log("open modal when user clicks arvostelebutton");
    modal2.style.display = "block";
  }

  span2.onclick = function() {
    modal2.style.display = "none";
  }

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
let json; //json is global...

function makeQueryForShowReviews(apartment) {

  const id = apartment;
  console.log(id);

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
  console.log('http://localhost:3000/api/results?id=' + searchedid);
  xmlhttp.open('GET', 'http://localhost:3000/api/results?id=' + searchedid,
      true);
  xmlhttp.send();
}

function showList(json) {
  console.log('showList');

  /*const divElement = document.getElementById('rating');

  const address = document.getElementById("address");
  let stringaddress;

  const shape = document.getElementById("shape");
  let stringshape;

  const comfort = document.getElementById("comfort");
  let stringcomfort;

  const grade = document.getElementById("grade");
  let stringrade;

  const free_word = document.getElementById("free_word");
  let string_free_word;

  let i;
  let string;

  for (i in json) {
      string = json[i].id + ', ' + json[i].osoite + ', ' + json[i].kunto +
          ', ' + json[i].viihtyvyys + ', ' + json[i].kokonaisarvosana + ', ' +
          json[i].vapaasana;

      divElement.innerHTML = string;

      stringaddress = json[i].osoite;
      address.innerHTML = stringaddress;

      stringshape = json[i].kunto;
      shape.innerHTML = stringshape;

      stringcomfort = json[i].viihtyvyys;
      comfort.innerHTML = stringcomfort;

      stringrade = json[i].kokonaisarvosana;
      grade.innerHTML = stringrade;

      string_free_word = json[i].vapaasana;
      free_word.innerHTML = string_free_word;

      console.log(string);
  }*/
  const divElement = document.getElementById('rating');

  const address = document.getElementById("address");
  let stringaddress;

  const shape = document.getElementById("shape");
  let stringshape;

  const comfort = document.getElementById("comfort");
  let stringcomfort;

  const grade = document.getElementById("grade");
  let stringrade;

  const free_word = document.getElementById("free_word");
  let string_free_word;

  let i;
  let string;

  for (i in json) {
    string = json[i].id + ', ' + json[i].address + ', ' + json[i].shape +
        ', ' + json[i].comfort + ', ' + json[i].grade + ', ' +
        json[i].free_word;

    divElement.innerHTML = string;

    stringaddress = json[i].address;
    address.innerHTML = stringaddress;

    stringshape = json[i].shape;
    shape.innerHTML = stringshape;

    stringcomfort = json[i].comfort;
    comfort.innerHTML = stringcomfort;

    stringrade = json[i].grade;
    grade.innerHTML = stringrade;

    string_free_word = json[i].free_word;
    free_word.innerHTML = string_free_word;

    console.log(string);
  }
}

function makeQueryForChat() {

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      json = JSON.parse(xmlhttp.responseText);
      console.log(json);
      if (json.length > 0) { // something found
        //console.log(json.length + ", " + json.rows[0].Name);
        showList2(json);
      } else {

      }
    }
  };
  console.log('http://localhost:3000/chat');
  xmlhttp.open('GET', 'http://localhost:3000/chat', true);
  xmlhttp.send();
}

function showList2(json) {
  console.log('showList2');

  let stringheader;

  let i;
  let string;

  for (i in json) {
    string = json[i].username + ', ' + json[i].header;

    const chat = document.getElementById('newchat');
    const newheader = document.createElement('li');
    chat.appendChild(newheader);

    stringheader = string;
    newheader.innerHTML = stringheader;

    console.log(string);
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
      //myFunction(resultArr);
      //document.getElementById("info").innerHTML = xmlhttp.responseText;
      if (json.length > 0) { // something found
        //console.log(json.length + ", " + json.rows[0].Name);
        showList3(json);
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

function showList3(json) {
  console.log('showList');

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
