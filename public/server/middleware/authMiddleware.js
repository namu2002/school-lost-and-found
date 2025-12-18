// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../../../school-lost-and-found/server/models/user');

const protect = async (req, res, next) => {
    let token;

    // Check for the token in the 'Authorization' header (standard JWT practice)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (removes 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user object to the request (excluding password)
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
// NEW: Authorization Middleware for Admin access
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ 
            message: 'Access denied. Administrator privileges required.' 
        });
    }
};

// NEW: Authorization Middleware for Admin OR Security access
const adminOrSecurity = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'security')) {
        next(); 
    } else {
        res.status(403).json({ 
            message: 'Access denied. Admin or Security privileges required.' 
        });
    }
};


// Export all required middleware
module.exports = { protect, adminOnly, adminOrSecurity };
