const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

const pug = require("pug");
app.set('views', path.join(__dirname, '/views'));
app.set("view engine", "pug");

const dbPopulate = require('../db/populate')();

const db = require('../db/init')();

// Saves login to browser session
app.use(require('express-session')({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));


let passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
passport = require('./passport/init')(passport);

// Authentication Routes:
const auth = require('./routes/auth')(passport);
app.use('/auth', auth);


app.get("/", (req, res) => {
  res.redirect('/auth/profile');
});

// Redirects so special routes are reserved for /auth:
app.all('/login', function(req, res) {
  res.redirect('/auth/login');
});
app.all('/logout', function(req, res) {
  res.redirect('/auth/logout');
});
app.all('/profile', function(req, res) {
  res.redirect('/auth/profile');
});

// Troubleshooting route to show all users
// Do not enable on production
app.get('/users', async (req, res) => {
  if (process.env.ENV === 'DEV') {
    const users = db.prepare('SELECT * FROM Users').all();
    res.send(users);
  } else {
    res.send('Endpoint not available unless ENV is "DEV"');
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});