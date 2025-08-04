// index.js
require('dotenv').config(); // <-- Add this line at the very top
require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const app = express();

// ...rest of your code
  // lib/mongodb.js
  import { MongoClient } from 'mongodb';

  // Next.js automatically loads environment variables from .env.local and .env
  // Do NOT import or use dotenv here!

  const MONGODB_URI = process.env.MONGODB_URI;
  const DB_NAME = 'theplancave'; // Explicitly define your database name

  if (!MONGODB_URI) {
    throw new Error(`
      ❌ MONGODB_URI not found in environment variables.
      Please add the following to your .env.local file:
      
      MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/theplancave?retryWrites=true&w=majority
    `);
  }

  let client;
  let clientPromise;

  if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable so the value is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    clientPromise = client.connect();
  }

  // Database instance with explicit name
  export const getDb = async () => {
    const client = await clientPromise;
    return client.db(DB_NAME);
  };

  export default clientPromise;
