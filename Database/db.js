const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const dbName = 'myDatabase'; // Replace with your database name

let dbConnection;

async function connectToDb() {
  if (dbConnection) {
    return dbConnection; // Return existing connection if already established
  }

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    dbConnection = client.db(dbName); // Get the database instance
    return dbConnection;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

module.exports = connectToDb;
