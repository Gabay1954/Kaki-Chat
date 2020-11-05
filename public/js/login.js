const socket = io();

function getInfo() {
	var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    socket.emit('login', { "username" : username, "password" : password });
}

function inscription() {
    var username = document.getElementById('username').value;
    var password01 = document.getElementById('password01').value;
    var password02 = document.getElementById('password02').value;
    if(password01 == password02){ 
        socket.emit('signup', { "username" : username, "password" : password01 });
    }
    else{
        window.alert("Erreur : mots de passe différents");
    }
}


socket.on('canSignUp', (canSignUp) => {
    console.log(canSignUp)
    if(canSignUp){
        localStorage.setItem('username',document.getElementById('username').value);
        localStorage.setItem('canConnect', 'true');
        window.open("rooms.html", "_self");
    } else {
        window.alert("Utilisateur déjà existant");
    }
});

socket.on('canLogin', (loginDetails) => {
    localStorage.setItem('username',loginDetails.username);
    localStorage.setItem('canConnect', 'true');

    if(loginDetails.canLogin){
        window.open("rooms.html", "_self");
    } else {
        window.alert("Erreur de connexion");
    }
});
