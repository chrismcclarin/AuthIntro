const express = require('express');
const authRouter = express.Router();
const Auth = require('../models/user');

authRouter.get('/', (req, res) => {
    res.render('home');
});

module.exports = authRouter