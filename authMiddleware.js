// middleware/authMiddleware.js (FULL CODE)
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 1. Authentication Middleware (Checks for valid token and fetches user)
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch user data EXCEPT the password
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            next();
        } catch (error) {
            console.error('Token validation failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

// 2. Authorization Middleware (Checks if the authenticated user is an Admin)
const adminOnly = (req, res, next) => {
    // Check if the user exists and their role is 'admin' (based on your user schema)
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // Forbidden status
        res.status(403).json({ 
            message: 'Access denied. You must be an administrator to view this resource.' 
        });
    }
};

module.exports = { protect, adminOnly };