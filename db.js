const mb = require('mongodb');
const mbclient = mb.MongoClient;
const ObjectID = mb.ObjectId;

let dataBase;
 
 async function getDatabase(){

      const client = await mbclient.connect('mongodb://127.0.0.1:27017/mongosh?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1') //  connection string
      dataBase = client.db('library');

      if (!dataBase) {
        console.log("database not connected");   // condition for occurence stats.
      }
       
      return dataBase;

    };

    module.exports = {
        getDatabase,
        ObjectID
    };