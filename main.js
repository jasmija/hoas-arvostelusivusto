function addToList() {
    var title = document.getElementById("title").value;
    console.log(title);

    var li = document.createElement('li');
    li.innerHTML = title + "<br>";

    var chat = document.getElementById("chat");
    chat.appendChild(li);
}

findString = function findText() {
    var input = document.getElementById("search").value;
    console.log(input);
    alert("String \x22" + input + "\x22 found? " + window.find(input));
    input.scrollIntoView();
}

function text(value){
    var div = document.getElementById("display");
    var text = "";

    if (value == 1) text += "this is one";
    if (value == 2) text += "this is two";
    if (value == 3) text += "this is tree";

    div.innerHTML = text;
}


