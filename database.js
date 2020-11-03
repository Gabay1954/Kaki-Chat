const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://kilian:kilian@cluster0.0q0er.mongodb.net/tp-mongo?retryWrites=true&w=majority";
const client = new MongoClient(uri);


// Fonction qui donne les informations d'un utilisateur
async function getUserDetails(userId){
  await client.connect();
  let res =  await client.db("tp-mongo").collection("users").findOne(
    {
      userId: userId
    }
  );
  return res;
}

// Fonction qui va aller chercher toutes les cartes avec l'ID d'un utilisateur 
async function findAllMessages(room) {
  await client.connect();
  return await client.db("tp-mongo").collection("message-gabriel").find(
    {
      room: room
    }
  ).sort({date : 1}).toArray();
}

async function insertMessage(message) {
  await client.connect();
  return await client.db("tp-mongo").collection("message-gabriel").insertOne(message);
}

// Fonction qui liste les tables existantes
async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

module.exports = { getUserDetails, findAllMessages, listDatabases, insertMessage }
