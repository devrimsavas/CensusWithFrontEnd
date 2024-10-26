// isThisAdmin.js

const session = require('express-session');
const path = require('path');
const fs = require('fs').promises; // Use promise-based fs module

const filepath = path.join(__dirname, 'data', 'admincredential.json');

async function isThisAdmin(req, res, next) {
    try {
        const data = await fs.readFile(filepath, { encoding: 'utf-8' });
        const adminCredentials = JSON.parse(data);

        // Check session and username only (assuming password verification is done at login)
        if (req.session.isAuthenticated && req.session.username === adminCredentials.login && req.session.password === adminCredentials.password) {
            next();
        } else {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Admin credentials are not valid',
            });
        }
    } catch (err) {
        console.error('Error reading credentials file:', err);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Error reading credentials file',
        });
    }
}

module.exports = isThisAdmin;

