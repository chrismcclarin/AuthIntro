const express = require('express');
const app = express();
const morgan = require('morgan');
const authController = require('./controllers/index')
const mongoose = require('mongoose');
require('dotenv').config();
const usersController = require('./controllers/users');
const expressSession = require('express-session')

// Database connection
const { PORT=3000, AUTH_URL, SECRET } = process.env
mongoose.connect(AUTH_URL);

app.set('view engine', '.ejs');

const db = mongoose.connection
db
    .on("error", (err) => console.log(err.message + " is mongo not running?"))
    .on("connected", () => console.log("mongo connected"))
    .on("disconnected", () => console.log("mongo disconnected"))

//middleware
app.use(express.urlencoded({
    extended: true
}));
app.use(morgan('dev'));
app.use(expressSession({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))

// Inspect our session store(where the cookies are) in terminal
app.use(function(req, res, next) {
    console.log('session store', req.session);
    next();
})

//routes
app.use('/', authController)
app.use('/', usersController)

//listeners
app.listen(PORT, () => console.log('the server is listening on ' + PORT));