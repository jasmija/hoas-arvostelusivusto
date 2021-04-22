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

//Get the modal
var modal = document.getElementById("modal");

//Get the button that opens the modal
var btn = document.getElementById("ratings");

//Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

//Open the modal, when the user clicks the kirjaudu button
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




