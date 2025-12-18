// controllers/authController.js
const User = require('../models/user'); // Ensure the path is correct
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    // IMPORTANT: Use a strong, secret key from your .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Token valid for 1 hour
    });
};

// --- 1. USER REGISTRATION ---
exports.registerUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Create new user (password is automatically hashed by the pre-save hook in user.js)
        user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'user', // Default to 'user' if role isn't specified
        });

        // Generate token and send response
        const token = generateToken(user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// --- 2. USER LOGIN ---
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            // Login successful
            const token = generateToken(user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
            });
        } else {
            // Login failed (user not found or password mismatch)
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Server error during login.' });
    }
};