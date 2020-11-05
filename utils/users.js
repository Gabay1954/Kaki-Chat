const users = [];

// utilisateur rejoint le chat
function userJoin(id, username, room, avatar) {
  const user = { id, username, room, avatar };

  users.push(user);

  return user;
}

// Obtenir l'utilisateur actuel
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// utilisateur quitte le chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Obtenir les utilisateurs de la salle
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
