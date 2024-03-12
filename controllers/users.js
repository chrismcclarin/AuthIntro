const express = require('express');
const usersRouter = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');

// Login Routes
usersRouter.get('/login', (req, res) => {
    res.render('login.ejs', {error: ''});
});

usersRouter.post('/login', (req, res) => {
    /*
    1) look up the user in the database based on email
        1.1) If the email does not exist - we need to let the user know 
        their credentials are invalid
        1.2) If the user exist, begin password compare process
    2) check to see if plain text password matches encrypted password
        2.1) If there is no match, we need to let the user know 
        their credentials are invalid
        2.2) If there is a match, move on to session creation.
    3) create a user session using req.session.
    4) redirect the user to a landing page
    */
    User.findOne({email:req.body.email}, (err,user) => {
        if (!user) return res.render('login', {error: 'Invalid Credentials'});

        const isMatched = bcrypt.compareSync(req.body.password, user.password);
        if (!isMatched) return res.render('login', {error: 'Invalid Credentials'});


        req.session.user = user._id; // creating the session to log the user log
        res.redirect('/');
    })
})

// Sign up Routes
usersRouter.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

usersRouter.post('/signup', (req, res) => {
    // 1) we create a user.
    //  1.1) Encrypt their plain text password with bcrypt
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12))
    // 2) redirect to GET /login
    User.create(req.body, (err, user) => {
        res.redirect('/login');
    })
})

// Logout Routes
usersRouter.get('/logout', (req, res) => {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

module.exports = usersRouter;