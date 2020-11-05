function bienvenue() {
    const msgcontainer = document.createElement('div');
    const divusername = document.createElement('div');
    const divavatar = document.createElement('div');
    const p = document.createElement('p');
    const avatar = document.createElement('img');

    divavatar.classList.add('room-avatar-bienvenue');
    avatar.classList.add('room-avatar-me')
    avatar.src="/img/"  + localStorage.getItem('avatar') + "-avatar.png";
    divavatar.appendChild(avatar);

    document.querySelector('.avatar-bienvenue').appendChild(divavatar);

    divusername.classList.add('room-username-me');
    p.classList.add('node');
    p.innerText = localStorage.getItem('username');
    divusername.appendChild(p);

    document.querySelector('.room-bienvenue').appendChild(divusername);
}

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


