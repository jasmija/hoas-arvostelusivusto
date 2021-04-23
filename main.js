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
    var input, uppercase, ul, li, h3, i, text;

    //Get search input field
    input = document.getElementById("search");

    //Input value to uppercase
    uppercase = input.value.toUpperCase();

    //List of apartments
    ul = document.getElementById("apartments");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        h3 = li[i].getElementsByTagName("h3")[0];
        text = h3.innerText;
        if (text.toUpperCase().indexOf(uppercase) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

window.onload = function(){
//VIEW REVIEWS
//Get the modal
var modal = document.getElementById("modal");

//Get the button that opens the modal
var btn = document.getElementById("ratings");

//Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//Open the modal, when the user clicks the image
btn.onclick = function() {
    modal.style.display = "block";
}

//Close the modal, when the user clicks on <span> (x)
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

    var ratebuttom = document.getElementById("kimpitie");
    console.log("after get arvostele button");

    var span2 = document.getElementsByClassName("close2")[0];
    console.log("after get close");

    ratebuttom.onclick = function() {
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

function visibleLogin() {
    var isloginopen = document.getElementById('login_wrap').style.visibility;
    console.log(isloginopen);
    if(isloginopen === "visible"){
        document.getElementById('login_wrap').style.visibility = "hidden";
        document.getElementById('login_wrap').style.display = "none";
    }else{
        document.getElementById("login_wrap").style.visibility = "visible";
        document.getElementById('login_wrap').style.display = "block";
    }
};

function hideLogin() {
    document.getElementById("login_wrap").style.visibility = "hidden";
};

/*CTRL F SEARCH FROM PAGE*/
/*function findText() {
    const input = document.getElementById('search').value;
    console.log(input);
    alert("String " + input + " found? " + window.find(input));
}*/

//SERVER JS
var json; //json is global...

function makeQuery() {
    var id = document.getElementById("searchid").value;
    if (id.length == 0) { // fix this and support empty field
        return;
    } else {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                json = JSON.parse(xmlhttp.responseText);
                console.log(json);
                //myFunction(resultArr);
                //document.getElementById("info").innerHTML = xmlhttp.responseText;
                if (json.length> 0){ // something found
                    //console.log(json.length + ", " + json.rows[0].Name);
                    showList(json);
                }
                else {
                    document.getElementById("rating").innerHTML = "<br/>Arvosteluita ei löytynyt yhtään.";
                }
            }
        };
        var searchedid = id;
        console.log("Haettu id: " + searchedid);
        console.log("http://localhost:8084/api/results?id=" + searchedid);
        xmlhttp.open("GET", "http://localhost:8084/api/results?id=" + searchedid, true);
        xmlhttp.send();
    }
}

function showList(json) {
    console.log("showList");

    var divElement = document.getElementById("rating");

    var i;
    var string;

    //var inputvalue = document.getElementsByTagName("input").value;
    //console.log("inputavalue " + inputvalue);
    for (i in json) {
        string = json[i].id + ", " + json[i].osoite + ", "+json[i].kunto +", "+json[i].viihtyvyys+", "+json[i].kokonaisarvosana + ", " + json[i].vapaasana;
        divElement.innerHTML = string;
        console.log(string);
    }
}




