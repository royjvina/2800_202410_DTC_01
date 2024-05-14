require('./include_config.js');

require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const Mongostore = require('connect-mongo');
const bcrypt = require('bcrypt');
const OpenAI = require("openai");
const openai = new OpenAI(
    { apiKey: process.env.OPENAI_API_KEY }
);
const constants = require('./constants.json');


/* const saltRounds = */
const port = process.env.PORT || 3000;
const expireTime = 1 * 60 * 60 * 1000;

const app = express();

const Joi = require('joi');

const mongodb_uri = process.env.MONGODB_URI;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;


app.set('views', path.join(__dirname, 'views'));
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
    req.session.recentPath = "/home";
    res.render('main');

});
app.get('/addFriend', (req, res) => {
    res.render('addFriend');
});
app.get('/addGroup', (req, res) => {
    res.render('addGroup');
});
app.get('/AI', (req, res) => {
    res.render('aiAdvisor');
});

app.post('/advisor', async function (req, res) {
    console.log(req.body);
    let { userMessages, assistantMessages } = req.body

    let messages = [
        { role: "system", content: constants.SYSTEM_COMMENT },
        { role: "user", content: constants.USER_COMMENT },
        { role: "assistant", content: constants.ASSISTANT_COMMENT },
    ]

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "' +
                    String(userMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "' +
                    String(assistantMessages.shift()).replace(/\n/g, "") + '"}')
            )
        }
    }

    const maxRetries = 3;
    let retries = 0;
    let completion
    while (retries < maxRetries) {
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages
            });
            break;
        } catch (error) {
            retries++;
            console.log(error);
            console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
        }
    }

    let chatGPTResult = completion.choices[0].message.content
    console.log(chatGPTResult);
    res.json({ "assistant": chatGPTResult });
});



// all unrealated routes
app.get('*', (req, res) => {
    res.status(404);
    res.render('404');
})

// error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.render('errorPage');
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
