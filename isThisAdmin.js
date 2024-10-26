// isThisAdmin.js
const session = require('express-session');
const path = require('path');
const fs = require('fs').promises;

async function isThisAdmin(req, res, next) {
    if (req.session.isAuthenticated) {
        next(); // Proceed if the session is already authenticated
    } else {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Admin credentials are not valid or session expired',
        });
    }
}

module.exports = isThisAdmin;
