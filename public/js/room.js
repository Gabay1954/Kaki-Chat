function goToRoom() {
    var room = document.getElementById('room').value;
    window.open("chat.html?username=" + localStorage.getItem('username') + "&room=" + room + "", "_self");
}

function disconnect(){
    localStorage.setItem('username','');
    localStorage.setItem('canConnect', 'false');
    localStorage.setItem('avatar', '');
}

if(localStorage.getItem('canConnect') === 'false' || localStorage.getItem('canConnect') == undefined){
    window.open(window.open("index.html", "_self"));
}


