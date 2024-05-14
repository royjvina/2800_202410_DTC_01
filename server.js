require('./include_config.js');

require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const Mongostore = require('connect-mongo');
const bcrypt = require('bcrypt');

/* const saltRounds = */
const port = process.env.PORT || 3000;
const expireTime = 1 * 60 * 60 * 1000;

const app = express();

const Joi = require('joi');

const mongodb_uri = process.env.MONGODB_URI;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

app.set("view engine", "ejs");

var { database } = include('databaseConnection');

const userCollection = database.db(mongodb_database).collection('users');

var mongoStore = Mongostore.create({
    mongoUrl: mongodb_uri,
    crypto: {
        secret: mongodb_session_secret
    },
});

app.use(session({
    secret: node_session_secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
    cookie: {
        httpOnly: true,
        maxAge: expireTime
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------- all functions ------- */
isValidSession = (req) => {
    if (req.session.authenticated) {
        return true;
    }
    return false;
};

/* ------- all routes ------- */

app.get('/home', (req, res) => {
    res.render('main');
});

app.get('/advisor', (req, res) => {
    res.render('ai_advisor');
});



// all unrealated routes
app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
})

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(200);
    res.render('error_page');
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
