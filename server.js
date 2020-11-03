const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//base de données
const MongoClient = require('mongodb').MongoClient;
const database = require('./database.js');

// dossier static
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Kaki Bot';

// client connect
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Bienvenue
    database.findAllMessages(room).then(
      result => {
        result.forEach(message => {
        socket.emit('message', message);
        });
        socket.emit('message', formatMessage(botName, 'Bienvenue sur Kaki'));
      })

    // diffusion utilisateur se connecte
    socket.broadcast.to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} à rejoint le chat`)
      );

    // Envoyer infos utilisateurs / rooms
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // écoute chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    console.log('on recoit un message: ', msg);
    msg.date = new Date();
    msg.username = user;
    io.to(user.room).emit('message', msg);
    database.insertMessage(msg);
  });

  // Quand utilisateurs se déconnectent
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} à quitté le chat`)
      );

      // envoyer info utilisateur et room
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`serveur tourne sur le port ${PORT}`));
