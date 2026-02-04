// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Import the controller functions that do the actual work
const { registerUser, loginUser } = require('../controllers/authController');

// Define the route for registering a new user
// When a POST request comes to '/register', run the registerUser function
router.post('/register', registerUser);

// Define the route for logging in a user
// When a POST request comes to '/login', run the loginUser function
router.post('/login', loginUser);


// Export the router so the main server file can use it
module.exports = router;