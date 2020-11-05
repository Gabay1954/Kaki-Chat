const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const moment = require('moment');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

//sécurité
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//base de données
const MongoClient = require('mongodb').MongoClient;
const database = require('./database.js');

// dossier static
app.use(express.static(path.join(__dirname, 'public')));

// client connect
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room, avatar }) => {
    const user = userJoin(socket.id, username, room, avatar);
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
    msg.date = moment(new Date()).format('h:mm');
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
  
  // Inscription 
  socket.on('signup', loginUser => {
    let canSignUp = true;
    database.getUsers().then(
      result => {
        result.forEach(user => {
          if(user.username.toLowerCase() == loginUser.username.toLowerCase()){
            canSignUp = false;
          }
        });
        if(canSignUp){
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(loginUser.password, salt, function(err, hash) {
                loginUser.password = hash;
                database.insertUser(loginUser);
          });
        });
        }
        io.to(socket.id).emit('canSignUp', canSignUp);  
      }
    );
    
  });

  // Connexion 
  socket.on('login', loginUser => {
    let canConnect = false;
    let avatar = ""
    database.getUsers().then(
      result => {
          result.forEach(user => {
            if(user.username.toLowerCase() == loginUser.username.toLowerCase() && bcrypt.compare(loginUser.password, user.password)){
              canConnect = true;
              avatar = user.avatar
            }
            if(canConnect){
              io.to(socket.id).emit('canLogin', {
                username : loginUser.username,
                avatar : avatar,
                canLogin : true
              });
            } else {
              io.to(socket.id).emit('canLogin', {
                canLogin : false  
              });
            }
          });
      }
    );
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`serveur tourne sur le port ${PORT}`));
