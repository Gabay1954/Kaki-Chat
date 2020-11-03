const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// nom d'utilisateur et room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// rejoindre chat
socket.emit('joinRoom', { username, room });

// room et utilisateur
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
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
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username.username;
  p.innerHTML += `<span>${(" " + date.toLocaleString("fr-FR") + "<br>")}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
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
