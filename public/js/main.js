const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// nom d'utilisateur et room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

let avatar = localStorage.getItem('avatar');
const socket = io();

// rejoindre chat
socket.emit('joinRoom', { username, room, avatar});

// room et utilisateur
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// message du serv
socket.on('info', info => {
  outputInfo(info);
  // actualisation du scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message du serv
socket.on('message', message => {
  outputMessage(message);
  // actualisation du scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// envoyer message
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // obtenir message
  let message = {
    text : e.target.elements.msg.value.trim(),
    username : username,
    room : room,
    date : new Date()
  }
  if (!message){
    return false;
  }

  // message serveur
  socket.emit('chatMessage', message);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// message de sorti vers le DOM
function outputMessage(message) {
  let date = new Date();
  if(message.date !== undefined){
    date = message.date;
  }
  
  const div = document.createElement('div');
  const divusername = document.createElement('div');
  const msgcontainer = document.createElement('div');
  const pdate = document.createElement('p');
  const p = document.createElement('p');
  const para = document.createElement('p');
  const avatar = document.createElement('img');

    if (message.username.username == username){

      if(document.getElementsByClassName("node").length == 0 || document.getElementsByClassName("node")[document.getElementsByClassName("node").length-1].innerHTML != message.username.username){
        divusername.classList.add('username-me');
        p.classList.add('node');
        p.innerText = message.username.username;
        divusername.appendChild(p);
        avatar.classList.add('avatar-chat-me')
        avatar.src="/img/"  + localStorage.getItem('avatar') + "-avatar.png";
        divusername.appendChild(avatar);
        msgcontainer.appendChild(divusername);
        document.querySelector('.chat-messages').appendChild(divusername);
        pdate.classList.add('text-date-me');
        pdate.innerHTML += `${(" " + date.toLocaleString("fr-FR"))}`;
        divusername.appendChild(pdate);
      }

      div.classList.add('message-me');  
      para.classList.add('text');
      para.innerText = message.text;
      div.appendChild(para); 
      msgcontainer.appendChild(div);
      document.querySelector('.chat-messages').appendChild(div);
    }
    else{
      console.log(message);
      if(document.getElementsByClassName("node").length == 0 || document.getElementsByClassName("node")[document.getElementsByClassName("node").length-1].innerHTML != message.username.username){
        divusername.classList.add('username');
        p.classList.add('node');
        p.innerText = message.username.username;
        divusername.appendChild(p); 
        avatar.classList.add('avatar-chat')
        avatar.src="/img/"  + message.username.avatar + "-avatar.png";
        divusername.appendChild(avatar);
        msgcontainer.appendChild(divusername);
        document.querySelector('.chat-messages').appendChild(divusername);
        pdate.classList.add('text-date');
        pdate.innerHTML += `${(" " + date.toLocaleString("fr-FR"))}`;
        divusername.appendChild(pdate);
      }
      div.classList.add('message');
      para.classList.add('text');
      para.innerText = message.text;
      div.appendChild(para);
      msgcontainer.appendChild(div);
      document.querySelector('.chat-messages').appendChild(div);
    }
}

function outputInfo(info){
  const msgcontainer = document.createElement('div');
  const div = document.createElement('div');
  const p = document.createElement('p');

  p.classList.add('text-bot');
  p.innerText = info;
  div.appendChild(p);
  msgcontainer.appendChild(div);
  document.querySelector('.chat-messages').appendChild(div);
}

// aujouter nom au DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// ajouter utilisateur du DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
