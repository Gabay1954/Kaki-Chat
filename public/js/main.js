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
  console.log(message);
  outputMessage(message);

  // actualisation du scroll
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// envoyer message
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // obtenir message
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // message serveur
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// message de sorti vers le DOM
function outputMessage(message) {
  var date = new Date();
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
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
