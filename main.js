function addToList() {
    var title = document.getElementById("title").value;
    console.log(title);

    var li = document.createElement('li');
    li.innerHTML = title + "<br>";

    var chat = document.getElementById("chat");
    chat.appendChild(li);
}

function findText() {
    var input = document.getElementById("search").value;
    console.log(input);
    alert("String " + input + " found? " + window.find(input));
}



