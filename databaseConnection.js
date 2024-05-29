// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import MongoClient from the mongodb package
const MongoClient = require('mongodb').MongoClient;

// Get the Atlas URI from environment variables
const atlasURI = process.env.ATLAS_URI;

// Initialize a new MongoClient instance with the Atlas URI
var database = new MongoClient(atlasURI);

// Export the database object for use in other modules
module.exports = { database };
