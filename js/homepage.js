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
  var string;

  for (i in json) {
    const searchresult = document.getElementById('rating');
    const header = document.getElementById('address');

    const container = document.getElementById("container");
    const div = document.createElement("div");
    div.setAttribute("id","review");
    div.setAttribute("class", "del");
    container.appendChild(div);

    const h = document.createElement("h3");
    h.innerHTML = "Kunto";
    div.appendChild(h);
    const p = document.createElement("p");
    div.appendChild(p);

    const h2 = document.createElement("h3");
    h2.innerHTML = "Viihtyvyys";
    div.appendChild(h2);
    const p2 = document.createElement("p");
    div.appendChild(p2);

    const h3 = document.createElement("h3");
    h3.innerHTML = "Kokonaisarvosana";
    div.appendChild(h3);
    const p3 = document.createElement("p");
    div.appendChild(p3);

    const h4 = document.createElement("h3");
    h4.innerHTML = "Vapaa sana";
    div.appendChild(h4);
    const p4 = document.createElement("p");
    div.appendChild(p4);

    string = json[i].address + ', ' + json[i].shape + ', ' + json[i].comfort + ', ' + json[i].grade + ', ' + json[i].free_word;

    searchresult.innerHTML = string;
    header.innerHTML = json[i].address;
    p.innerHTML = json[i].shape;
    p2.innerHTML = json[i].comfort;
    p3.innerHTML = json[i].grade;
    p4.innerHTML = json[i].free_word;
  }

  countAverage(json);
}

function countAverage(json) {

  var sumcomfort = 0;
  var sumgrade = 0;
  var sumshape = 0;

  for( var i = 0; i < json.length; i++ ) {
    //console.log("Viihtyvyys " + json[i].comfort);
    sumcomfort = sumcomfort + json[i].comfort;
    sumgrade = sumgrade + json[i].grade;

    if (json[i].shape === "välttävä") {
      json[i].shape = 1;
      console.log(json[i].shape);
    }else if (json[i].shape === "Tyydyttävä"){
      json[i].shape  = 2;
      console.log(json[i].shape);
    }else if (json[i].shape === "Hyvä"){
      json[i].shape = 3;
      console.log(json[i].shape);
    }else if (json[i].shape === "Kiitettävä"){
      json[i].shape = 4;
      console.log(json[i].shape);
    }

    sumshape = sumshape +  json[i].shape;
    console.log("Summa kunnosta " + sumshape);
    //console.log("Summa " + sumcomfort);
  }

  //console.log(sumcomfort);
  //console.log(json.length);
  const averageshape = sumshape / json.length;
  console.log("Keskiarvo kunto " + averageshape);

  const averagecomfort = sumcomfort / json.length;
  console.log("Keskiarvo viihtyvyys " + averagecomfort);

  const averagegrade = sumgrade / json.length;
  console.log("Keskiarvo kokonaisarvosana " + averagegrade);

  document.getElementById("averageshape").innerHTML = averageshape.toString();
  document.getElementById("averagecomfort").innerHTML = averagecomfort.toString();
  document.getElementById("averagegrade").innerHTML = averagegrade.toString();

  /*for (i in json) {
    const shape = json[i].comfort;
    console.log("Viihtyvyys " + json[i].comfort);
    sum += shape;
    console.log("Summa " + sum);
  }*/

  /*const averagecomfort = sum / i;
  console.log("Keskiarvo viihtyvyys " + averagecomfort);*/
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
  console.log("Id !!!!!" + id);

  const xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
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
}

  function makeQueryForSendForm(apartment) {

    console.log(apartment);
    var id = apartment;
    console.log(id);

    // make a JSON string and send it to a server
    var shape = document.getElementById("shape").value;
    console.log(shape);
    var comfort = document.getElementById("comfort").value;
    console.log(comfort);
    var grade = document.getElementById("grade").value;
    console.log(grade);
    var free_word = document.getElementById("free_word").value;
    console.log(free_word);

    var newReview = '{"id": "'+id+'", "shape": "'+shape+'", "comfort": "'+comfort+'", "grade": "'+grade +'", "free_word": "'+
        free_word+'"}'

    document.getElementById("test2").innerHTML = newReview;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

        document.getElementById("test").innerHTML = xmlhttp.responseText;
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
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlhttp.send(newReview);
}

