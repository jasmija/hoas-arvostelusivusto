function addToList() {
    const title = document.getElementById('title').value;
    console.log(title);

    const li = document.createElement('li');
    li.innerHTML = title + "<br>";

    const chat = document.getElementById('chat');
    chat.appendChild(li);
}

function findText() {
    const input = document.getElementById('search').value;
    console.log(input);
    alert("String " + input + " found? " + window.find(input));
}



