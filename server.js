const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const moment = require('moment');
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
        message.date = moment(message.date).format('h:mm');
        socket.emit('message', message);
        });
      })

    // Quand utilisateur se connecte
    socket.broadcast.to(user.room)
      .emit(
        'info',
        `${user.username} à rejoint le chat`
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
    msg.username = user;
    msg.date = moment(new Date()).format('h:mm a');
    io.to(user.room).emit('message', msg);
    msg.date = new Date()
    database.insertMessage(msg);
  });

  // Quand utilisateur se déconnecte
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        'info',
        `${user.username} à quitté le chat`
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
