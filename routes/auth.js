
//this routes are for admin login and logout


var express = require('express');
var router = express.Router();
var fs = require('fs').promises;
var path = require('path');

var isThisAdmin = require('../isThisAdmin');
var session = require('express-session');

// Login page check if admin is already logged in
router.get('/login', function(req, res, next) {
    let userName=req.session.isAuthenticated || "Guest";
    res.render('login', { 
        title: 'Census Application',
        username:userName});
});

router.post('/login', async function(req, res, next) {
    let { login, password } = req.body; // Get credentials from form or POSTMAN

    if (!login || !password) {
        return res.status(400).json({
            error: 'All fields are required both for login and password'
        });
    }

    // Use environment variables directly
    const adminLogin = process.env.LOGIN;
    const adminPassword = process.env.PASSWORD;

    // Check both login and password
    if (login === adminLogin && password === adminPassword) {
        req.session.isAuthenticated = true;  // Set session as authenticated
        req.session.username = login;  // Optionally store the username for later use
        res.json({
            message: 'Login successful'
        });
    } else {
        res.status(401).json({
            error: 'Invalid credentials'
        });
    }
});

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;
