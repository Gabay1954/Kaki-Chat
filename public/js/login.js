var objPeople = [
	{
		username: "O2",
		password: "aude"
    },
    {
		username: "alex",
		password: "alex1234"
	}
]

function getInfo() {
	var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var connected = false;

	for(var i = 0; i < objPeople.length; i++) {
		if(username == objPeople[i].username && password == objPeople[i].password) {
            window.open("rooms.html", "_self");
            connected = true;
			return 
        }
    }
    if(!connected){
        window.alert("Erreur de connexion");
    }
}

function inscription() {
    var username = document.getElementById('username').value;
    var password01 = document.getElementById('password01').value;
    var password02 = document.getElementById('password02').value;
    var usernamefailed = "";
    var connected = false;

    for(var i = 0; i < objPeople.length; i++) {
        if(username == objPeople[i].username){
            usernamefailed = "gaksierlsiroslrodfqzdsfkdirkdrthkrjnd";
        }
        else{
            usernamefailed = username;
        }
    }
    if(password01 == password02 && username == usernamefailed){
        objPeople.push({"username": username, "password": password01});
        window.open("index.html", "_self");
        connected = true;
        return
    }
    if(!connected){
        window.alert("Erreur de création");
    }
console.log(objPeople);
}
