// --- IMPORTS ---
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') }); // Robustly find .env
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('../db'); // Correct path to db.js

// --- ROUTE IMPORTS ---
// Assuming your 'Routes' folder is inside the 'server' folder
const lostItemRoutes = require('./routes/lostitemroutes');
const foundItemRoutes = require('./routes/founditemroutes');
const authRoutes = require('./routes/authRoutes'); // Added this back in

// --- APP INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- DATABASE CONNECTION ---
// Assuming connectDB is an async function
connectDB();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- STATIC FILE SERVER ---
// **THIS IS THE FIX**: Go UP one level '..' to find the 'public' folder.
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- API ROUTES ---
app.use('/api/lost-items', lostItemRoutes);
app.use('/api/found-items', foundItemRoutes);
app.use('/api/auth', authRoutes); // Added this back in

// --- FRONT-END CATCH-ALL ROUTE ---
// **THIS IS THE FIX**: Go UP one level '..' to find the 'public' folder.
// This route sends index.html for any non-API request.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
