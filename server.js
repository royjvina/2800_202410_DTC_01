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
    );

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
sessionValidation = (req, res, next) => {
    if (isValidSession(req)) {
        next();
    }
    else {
        res.redirect('/')
    }
}


/* ------- all routes ------- */

const authRouter = require("./routes/authentication");
const aiAdvisorRouter = require("./routes/aiAdvisor");
const homeRouter = require("./routes/home");
const personalRouter = require("./routes/personal");
const recentRouter = require("./routes/recentActivity");
const getImagesFromDB = require("./routes/getImagesFromDB");
const addExpenseRouter = require("./routes/addExpenses");
const groupsRouter = require("./routes/groups");
const individualExpenseRouter = require("./routes/individualExpense");
const recentActivityRouter = require("./routes/recentActivity");
const settingsRouter = require("./routes/settings");
const expensePersonalRouter = require("./routes/expensePersonal");



app.use("/", authRouter);
app.use("/", sessionValidation, aiAdvisorRouter);
app.use("/", sessionValidation, homeRouter);
app.use("/", sessionValidation, personalRouter);
app.use("/", sessionValidation, recentRouter);
app.use("/", sessionValidation, getImagesFromDB);
app.use("/", sessionValidation, addExpenseRouter);
app.use("/", sessionValidation, groupsRouter);
app.use("/", sessionValidation, individualExpenseRouter);
app.use("/", sessionValidation, recentActivityRouter);
app.use("/", sessionValidation, settingsRouter);
app.use("/", sessionValidation, personalRouter);
app.use("/", sessionValidation, expensePersonalRouter);









// all unrealated routes
app.get('*', (req, res) => {
    res.render('404', { path: req.path });
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    if (err.status === 400) {
        res.status(400).render('error400', { path: req.path });
    } else {
        res.status(500).render('error500', { path: req.path });
    }
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
