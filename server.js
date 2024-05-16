require('./include_config.js');

require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const Mongostore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors')

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


mongoose.connect(mongodb_uri)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
    }
    )

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

app.use(cors());
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

const authRouter = require("./routes/authentication")
const aiAdvisorRouter = require("./routes/aiAdvisor")

app.use("/", authRouter);
app.use("/", aiAdvisorRouter);


app.get('/home', (req, res) => {
    res.render('main');
});

app.get('/addFriend', (req, res) => {
    res.render('addFriend');
});

app.get('/addExpenses', (req, res) => {
    res.render('addExpenses')
})

app.get('/addGroup', (req, res) => {
    res.render('addGroup');
});

app.get('/individualExpense', (req, res) => {
    res.render('individualExpense');
});

app.get('/individualExpense', (req, res) => {
    res.render('individualExpense');
});

app.get('/recentActivity', (req, res) => {
    res.render('recentActivity');
})

// all unrealated routes
app.get('*', (req, res) => {
    res.render('404');
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    if (err.status === 400) {
        res.status(400).render('error400');
    } else {
        res.status(500).render('error500');
    }
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
