import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
    console.log('mongodb is connected!');
} catch (e) {
    console.error(e);
}

const usersDb = client.db("users");
const requestsDb = client.db("requests");

export { usersDb, requestsDb };