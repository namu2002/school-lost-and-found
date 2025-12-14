// Routes/authRoutes.js (Conceptual update)
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import the new middleware

// Public routes for registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected route (only accessible if logged in)
router.get('/profile', protect, (req, res) => {
    // req.user is available here from the middleware
    res.json({ user: req.user, message: 'You accessed your secure profile!' });
});

module.exports = router;