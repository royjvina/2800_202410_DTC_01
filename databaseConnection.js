require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const atlasURI = process.env.ATLAS_URI;
var database = new MongoClient(atlasURI);

module.exports = { database };