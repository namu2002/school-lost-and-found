// This is the complete code for: server/middleware/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
    // This middleware runs *after* the authMiddleware.
    // authMiddleware has already decoded the token and attached the user object to `req.user`.

    // We check if a user object exists on the request and if that user's role is 'admin'.
    if (req.user && req.user.role === 'admin') {
        // If the user is an admin, allow the request to continue to the next function (the actual route handler).
        next();
    } else {
        // If the user is not an admin (or not logged in), send a "Forbidden" error.
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = adminMiddleware;