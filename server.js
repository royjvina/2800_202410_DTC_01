// Load global configurations and environment variables
require('./include_config.js');
require('dotenv').config();

// Import necessary packages
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const cors = require('cors');

// Define constants for port and session expiration time
const port = process.env.PORT || 3000;
const expireTime = 1 * 60 * 60 * 1000;

// Create an Express application
const app = express();

// Define MongoDB configuration variables
const mongodb_uri = process.env.MONGODB_URI;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

// Set the view engine to EJS and define the views directory
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// Connect to MongoDB using Mongoose
mongoose.connect(mongodb_uri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Create a session store using MongoDB
var mongoStore = MongoStore.create({
    mongoUrl: mongodb_uri,
    crypto: {
        secret: mongodb_session_secret
    },
});

// Configure session management
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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS, JSON parsing, and URL-encoded form parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to check if user is authenticated
const isValidSession = (req) => req.session.authenticated;
const sessionValidation = (req, res, next) => {
    if (isValidSession(req)) {
        next();
    } else {
        res.redirect('/');
    }
};

// Import route modules
const authRouter = require("./routes/authentication");
const aiAdvisorRouter = require("./routes/aiAdvisor");
const homeRouter = require("./routes/home");
const personalRouter = require("./routes/personal");
const addExpenseRouter = require("./routes/addExpenses");
const groupsRouter = require("./routes/groups");
const individualExpenseRouter = require("./routes/individualExpense");
const settingsRouter = require("./routes/settings");
const suggestedReimbursementsRouter = require("./routes/suggestedReimbursements");
const expensePersonalRouter = require("./routes/expensePersonal");
const recentActivityRouter = require("./routes/recentActivity");
const insightRouter = require("./routes/insight");

// Use routes with session validation where needed
app.use("/", authRouter);
app.use("/", sessionValidation, aiAdvisorRouter);
app.use("/", sessionValidation, homeRouter);
app.use("/", sessionValidation, personalRouter);
app.use("/", sessionValidation, addExpenseRouter);
app.use("/", sessionValidation, groupsRouter);
app.use("/", sessionValidation, individualExpenseRouter);
app.use("/", sessionValidation, recentActivityRouter);
app.use("/", sessionValidation, settingsRouter);
app.use("/", sessionValidation, personalRouter);
app.use("/", sessionValidation, suggestedReimbursementsRouter);
app.use("/", sessionValidation, expensePersonalRouter);
app.use("/", sessionValidation, recentActivityRouter);
app.use("/", sessionValidation, insightRouter);

// Catch-all route for 404 errors
app.get('*', (req, res) => {
    res.render('404', { path: req.path });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);

    if (err.status === 400) {
        res.status(400).render('error400', { path: req.path });
    } else {
        res.status(500).render('error500', { path: req.path });
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
